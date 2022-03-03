FROM openjdk:16-alpine3.13
WORKDIR /app
ENV RABBIT_MQ_URL=10.28.20.222:5672
ENV USERNAME=guest
ENV PASS=guest
COPY bin ./bin
COPY lib/ ./lib
COPY images ./images
CMD ["sh","bin/runjava","com.rabbitmq.perf.PerfTest","-mpr","--uri","amqp://guest:guest@10.28.20.222:5672"]
