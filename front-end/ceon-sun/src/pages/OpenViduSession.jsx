// src/pages/OpenViduSession.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";

// Heroicons (solid)
import {
  MicrophoneIcon,
  VideoCameraIcon,
  ComputerDesktopIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";

// --- Yjs + OpenVidu 시그널 연동 ---
class OpenViduProvider {
  constructor(doc, session, options = {}) {
    this.doc = doc;
    this.session = session;
    this.signalType = options.signalType || "code-update";
    // Yjs 문서 업데이트 시 signal 전송
    this.doc.on("update", this._sendUpdate.bind(this));
    // OpenVidu 시그널 이벤트 수신
    this.session.on(
      "signal:" + this.signalType,
      this._receiveUpdate.bind(this),
    );
  }
  _sendUpdate(update) {
    const encoded = btoa(String.fromCharCode(...update));
    this.session
      .signal({
        type: this.signalType,
        data: encoded,
      })
      .catch((error) => {
        console.error("업데이트 전송 오류:", error);
      });
  }
  _receiveUpdate(event) {
    const decodedStr = atob(event.data);
    const update = new Uint8Array(
      decodedStr.split("").map((c) => c.charCodeAt(0)),
    );
    Y.applyUpdate(this.doc, update);
  }
}

// --- 탭 식별자와 표시용 라벨 ---
const TAB_INFO = {
  screen: { id: "screen", label: "화면 공유" },
  editor: { id: "editor", label: "코드 에디터" },
};

const OpenViduSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // navigate로 전달된 값
  const { token, contractedClassId, nickname } = location.state || {};

  // OpenVidu 관련 ref
  const OV = useRef(null);
  const session = useRef(null);

  // 로컬 퍼블리셔(카메라/오디오)
  const [publisher, setPublisher] = useState(null);
  // 화면공유 퍼블리셔
  const [screenPublisher, setScreenPublisher] = useState(null);

  // 오디오/비디오 활성 여부
  const [audioActive, setAudioActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);

  // 메인 화면 탭 목록, 현재 선택된 탭
  // 예: tabs: ["screen", "editor"], selectedTab: "editor"
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);

  // 화면공유를 렌더링할 ref (탭이 "screen"일 때 표시)
  const screenContainerRef = useRef(null);

  // Yjs 문서, Provider 관련 ref
  const ydocRef = useRef(new Y.Doc());
  const yTextRef = useRef(null);
  const providerRef = useRef(null);
  const editorRef = useRef(null);
  const [isEditorActive, setIsEditorActive] = useState(false);

  // 채팅 관련 state
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // { nickname, text }

  // 오른쪽 영역: 상대 비디오 렌더링
  const remoteVideosRef = useRef(null);

  // -------------------------
  // 시그널: 탭 추가/제거/선택
  // -------------------------
  const addTabSignal = (tabId) => {
    session.current.signal({
      type: "tab-add",
      data: tabId,
    });
  };
  const removeTabSignal = (tabId) => {
    session.current.signal({
      type: "tab-remove",
      data: tabId,
    });
  };
  const selectTabSignal = (tabId) => {
    session.current.signal({
      type: "tab-select",
      data: tabId,
    });
  };

  // -------------------------
  // 로컬에서 탭 추가/제거/선택
  // -------------------------
  const addTabLocal = (tabId) => {
    setTabs((prev) => {
      if (!prev.includes(tabId)) {
        return [...prev, tabId];
      }
      return prev;
    });
    setSelectedTab(tabId);
  };
  const removeTabLocal = (tabId) => {
    setTabs((prev) => prev.filter((t) => t !== tabId));
    setSelectedTab((prev) => (prev === tabId ? null : prev));
  };
  const selectTabLocal = (tabId) => {
    if (tabs.includes(tabId)) {
      setSelectedTab(tabId);
    }
  };

  // -------------------------
  // 초기화
  // -------------------------
  useEffect(() => {
    if (!token || !nickname) {
      console.error("필수 정보(token, nickname)가 누락되었습니다.");
      return;
    }
    // OpenVidu 초기화
    OV.current = new OpenVidu();
    session.current = OV.current.initSession();

    // --- 1) 원격 스트림 구독 ---
    session.current.on("streamCreated", (event) => {
      const subscriber = session.current.subscribe(
        event.stream,
        remoteVideosRef.current,
      );
      subscriber.on("videoElementCreated", (evt) => {
        console.log("원격 비디오 요소 생성:", evt.element);
      });
    });

    // --- 2) 채팅 수신 ---
    session.current.on("signal:chat", (event) => {
      const data = event.data; // 전송된 메시지
      const from = JSON.parse(event.from.data).clientData; // 보낸 사람
      setMessages((prev) => [...prev, { nickname: from, text: data }]);
    });

    // --- 3) 탭 관련 시그널 수신 ---
    session.current.on("signal:tab-add", (event) => {
      const tabId = event.data;
      if (tabId === "screen") {
        // 상대가 화면공유를 켰을 때
        addTabLocal(tabId);
      } else if (tabId === "editor") {
        // 상대가 에디터를 켰을 때
        addTabLocal(tabId);
        setIsEditorActive(true);
      }
    });
    session.current.on("signal:tab-remove", (event) => {
      const tabId = event.data;
      removeTabLocal(tabId);
      if (tabId === "screen") {
        // 상대가 화면공유를 끄면
        setScreenPublisher(null);
      } else if (tabId === "editor") {
        // 상대가 에디터를 끄면
        setIsEditorActive(false);
      }
    });
    session.current.on("signal:tab-select", (event) => {
      const tabId = event.data;
      selectTabLocal(tabId);
    });

    // --- 4) 세션 연결 ---
    session.current
      .connect(token, { clientData: nickname })
      .then(() => {
        console.log("오픈비두 접속 후 세션 연결 성공");
        // 카메라/오디오 퍼블리셔
        const localPublisher = OV.current.initPublisher(undefined, {
          publishVideo: true,
          publishAudio: true,
          resolution: "640x480",
        });
        session.current.publish(localPublisher);
        setPublisher(localPublisher);

        // Yjs + OpenViduProvider
        providerRef.current = new OpenViduProvider(
          ydocRef.current,
          session.current,
          { signalType: "code-update" },
        );
      })
      .catch((error) => console.error("세션 연결 실패:", error));

    // 언마운트 시 정리
    return () => {
      if (session.current) {
        session.current.disconnect();
      }
      ydocRef.current.destroy();
    };
  }, [token, nickname]);

  // -------------------------
  // 화면공유 on/off
  // -------------------------
  const toggleScreenShare = async () => {
    if (!session.current) return;

    // 이미 화면공유 중이면 중지
    if (screenPublisher) {
      session.current.unpublish(screenPublisher);
      screenPublisher.stream.dispose();
      setScreenPublisher(null);
      removeTabSignal(TAB_INFO.screen.id); // 탭 제거 시그널
      return;
    }

    // 새 화면공유 퍼블리셔 생성
    try {
      const newScreenPublisher = OV.current.initPublisher(undefined, {
        videoSource: "screen", // 화면공유
        publishAudio: false,
        publishVideo: true,
        mirror: false,
      });

      await session.current.publish(newScreenPublisher);
      setScreenPublisher(newScreenPublisher);

      addTabSignal(TAB_INFO.screen.id); // 탭 추가 시그널

      // 화면공유 종료 시(브라우저 UI에서 “공유 중지”)
      newScreenPublisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .addEventListener("ended", () => {
          console.log("화면공유 종료됨");
          toggleScreenShare();
        });

      // 로컬 사용자의 화면공유 영상을 표시(선택 탭이 "screen"일 때)
      newScreenPublisher.on("videoElementCreated", (evt) => {
        if (screenContainerRef.current) {
          screenContainerRef.current.innerHTML = "";
          screenContainerRef.current.appendChild(evt.element);
        }
      });
    } catch (error) {
      console.error("화면공유 시작 실패:", error);
    }
  };

  // -------------------------
  // 에디터 on/off
  // -------------------------
  const toggleEditor = () => {
    if (!isEditorActive) {
      // 에디터 활성화
      setIsEditorActive(true);
      addTabSignal(TAB_INFO.editor.id);
    } else {
      // 에디터 비활성화
      setIsEditorActive(false);
      removeTabSignal(TAB_INFO.editor.id);
    }
  };

  // -------------------------
  // 오디오/비디오 on/off
  // -------------------------
  const toggleAudio = () => {
    if (!publisher) return;
    const nextState = !audioActive;
    publisher.publishAudio(nextState);
    setAudioActive(nextState);
  };
  const toggleVideo = () => {
    if (!publisher) return;
    const nextState = !videoActive;
    publisher.publishVideo(nextState);
    setVideoActive(nextState);
  };

  // -------------------------
  // 채팅 전송
  // -------------------------
  const handleSendChat = () => {
    if (!message.trim() || !session.current) return;
    session.current
      .signal({
        type: "chat",
        data: message,
      })
      .then(() => {
        // 내 채팅도 화면에 표시
        setMessages((prev) => [...prev, { nickname, text: message }]);
        setMessage("");
      })
      .catch((error) => console.error("채팅 전송 오류:", error));
  };

  // -------------------------
  // 세션 나가기
  // -------------------------
  const handleLeaveSession = () => {
    if (session.current) {
      session.current.disconnect();
    }
    navigate("/mainpage"); // 원하는 경로로 이동
  };

  // -------------------------
  // Monaco Editor onMount
  // -------------------------
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    yTextRef.current = ydocRef.current.getText("monaco");
    // 초기 내용 동기화
    editor.setValue(yTextRef.current.toString());

    // 에디터 내용 변경 시 Yjs 업데이트
    editor.onDidChangeModelContent(() => {
      const currentValue = editor.getValue();
      yTextRef.current.delete(0, yTextRef.current.length);
      yTextRef.current.insert(0, currentValue);
    });

    // Yjs 업데이트 시 에디터 내용 반영
    yTextRef.current.observe(() => {
      const newValue = yTextRef.current.toString();
      if (editor.getValue() !== newValue) {
        editor.setValue(newValue);
      }
    });
  };

  // -------------------------
  // 메인화면 탭 영역 렌더링
  // -------------------------
  const renderTabs = () => {
    if (tabs.length === 0) {
      // 탭이 하나도 없으면 "공유중인 화면이 없습니다." 가운데 표시
      return (
        <div className="flex flex-col flex-1 items-center justify-center text-gray-500 h-full">
          공유중인 화면이 없습니다.
        </div>
      );
    }
    return (
      <div className="flex-1 flex flex-col relative">
        {/* 탭 목록 */}
        <div className="flex border-b bg-gray-100">
          {tabs.map((tabId) => (
            <button
              key={tabId}
              onClick={() => {
                setSelectedTab(tabId);
                selectTabSignal(tabId); // 탭 선택 시그널
              }}
              className={`px-4 py-2 ${
                selectedTab === tabId ? "bg-white" : "bg-gray-200"
              } border-r last:border-r-0`}
            >
              {TAB_INFO[tabId]?.label || tabId}
            </button>
          ))}
        </div>

        {/* 탭 내용 표시 */}
        <div className="flex-1 relative">
          {selectedTab === "screen" && (
            <div
              ref={screenContainerRef}
              className="absolute inset-0 flex items-center justify-center bg-black"
            />
          )}
          {selectedTab === "editor" && (
            <div className="absolute inset-0">
              <Editor
                height="100%"
                theme="vs-dark"
                defaultValue="// 코드를 작성하세요\n"
                language="javascript"
                onMount={handleEditorDidMount}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen flex">
      {/* 왼쪽: flex-1, 오른쪽: 고정폭 480px */}
      <div className="flex-1 flex flex-col border-r relative">
        {/* 상단 바 */}
        <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
          <button
            onClick={handleLeaveSession}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            종료하기
          </button>
        </div>

        {/* 메인 화면 (탭 구조) */}
        <div className="flex-1 bg-black">{renderTabs()}</div>

        {/* 하단 네비게이션 (메인화면 하단에 둥둥 떠있는 형태) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full p-2 shadow flex space-x-3">
            {/* 오디오 */}
            <button
              onClick={toggleAudio}
              className={`w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 ${
                !audioActive ? "bg-red-100" : ""
              }`}
              title="오디오 On/Off"
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            {/* 비디오 */}
            <button
              onClick={toggleVideo}
              className={`w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 ${
                !videoActive ? "bg-red-100" : ""
              }`}
              title="비디오 On/Off"
            >
              <VideoCameraIcon className="w-5 h-5" />
            </button>
            {/* 화면공유 */}
            <button
              onClick={toggleScreenShare}
              className={`w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 ${
                screenPublisher ? "bg-green-100" : ""
              }`}
              title="화면공유"
            >
              <ComputerDesktopIcon className="w-5 h-5" />
            </button>
            {/* 에디터 */}
            <button
              onClick={toggleEditor}
              className={`w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 ${
                isEditorActive ? "bg-green-100" : ""
              }`}
              title="코드 에디터"
            >
              <CodeBracketIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽: 480px 고정 */}
      <div className="w-[420px] flex flex-col">
        {/* 상대 비디오 영역 (300px) */}
        <div
          ref={remoteVideosRef}
          className="h-[280px] bg-gray-300 flex items-center justify-center"
        >
          <p className="text-black">상대 비디오</p>
        </div>

        {/* 채팅 영역 (나머지) */}
        <div className="flex-1 border-t border-gray-300 flex flex-col">
          <div className="flex-1 p-2 space-y-2 overflow-auto">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.nickname}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded p-2 mr-2"
              placeholder="메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendChat();
              }}
            />
            <button
              onClick={handleSendChat}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenViduSession;
