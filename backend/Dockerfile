FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw || true 
RUN ./mvnw clean package -DskipTests || mvn clean package -Dskiptests

EXPOSE 8080

CMD ["java", "-jar", "target/school-erp-backend-1.0.0.jar"]