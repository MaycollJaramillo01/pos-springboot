## POS with Spring Boot


POS made with spring boot, maven and lombok

## Instructions

1) Install Eclipse, or something with jdtls in your machine
2) Install Lombok inside eclipse
3) Install maven in your machine
4) Create a postgresql database running docker-compose up -d in the /infra folder
5) Add this in to your application.properties file:


spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update

6) Use the command:

``` mvn spring-boot:run ```

for installing all the libraries and running the project

If you followed all the instructions behind, the project should run

6) Go to http://localhost:8080/swagger-ui/index.html in your machine
7) Voila, now you have the POS backend running in your machine, add the frontend you prefer
