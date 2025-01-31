# Step 1: Build Stage
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean build -x test

# Step 2: Runtime Stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/gateway-service.jar app.jar
EXPOSE 8080

# Default Spring Profile
ENV SPRING_PROFILES_ACTIVE=prod

# Run Application
ENTRYPOINT ["java", "-jar", "app.jar"]
