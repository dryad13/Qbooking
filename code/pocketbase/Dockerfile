FROM alpine:latest

ARG PB_VERSION=0.22.8

RUN apk add --no-cache \
    unzip \
    ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Data will be stored inside the container and wiped on restart (free tier demo)
EXPOSE 8090

# Start PocketBase. It will bind to 0.0.0.0 so Render can route traffic to it.
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
