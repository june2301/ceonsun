package com.chunsun.template.interceptor;

import com.chunsun.template.common.error.GlobalErrorCodes;
import com.chunsun.template.common.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class UserInterceptor implements HandlerInterceptor {

    private static final String USER_ID_HEADER = "X-User-ID";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String userIdHeader  = request.getHeader(USER_ID_HEADER);

        try {
            Long userId = Long.parseLong(userIdHeader);
            request.setAttribute("UserId", userId);

            return true;
        } catch (RuntimeException e) {
            throw new BusinessException(GlobalErrorCodes.INVALID_HEADER_DATA);
        }
    }
}
