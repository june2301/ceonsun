# Step 1: Build Stage
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# Step 2: Runtime Stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/build/libs/chat-consumer.jar app.jar

<<<<<<< HEAD
# Set active profile to 'prod'
ENV SPRING_PROFILES_ACTIVE=prod

=======
>>>>>>> 044cd807f709a564a81d0de9c3d4828c99924eed
# Run Application
ENTRYPOINT ["java", "-jar", "app.jar"]