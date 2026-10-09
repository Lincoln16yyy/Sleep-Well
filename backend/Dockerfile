# syntax=docker/dockerfile:1

# ---- Etapa 1: compila o JAR (Maven + JDK 21) ----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace

COPY pom.xml .
COPY src ./src

# Testos ficam de fora da imagem: a CI (GitHub Actions) já roda mvn -B verify
RUN mvn -B -DskipTests package

# ---- Etapa 2: executa com JRE 21, sem privilegios ----
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN useradd --system --uid 1001 --create-home appuser

# target/ contem apenas o boot jar (o .jar.original nao casa com *.jar)
COPY --from=build /workspace/target/*.jar /app/app.jar
RUN chown appuser:appuser /app/app.jar

USER appuser
EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
