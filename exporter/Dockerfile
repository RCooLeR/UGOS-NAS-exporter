# --- Stage 1: Build the Go binary ---
FROM golang:1.26.2-alpine AS builder

# Install git and CA certs (if needed for Go modules)
RUN apk upgrade --no-cache && apk add --no-cache git ca-certificates

# Set working directory inside the container
WORKDIR /app

ARG VERSION=dev
ARG COMMIT=none
ARG DATE=unknown

# Copy Go source code into the container
COPY . .

# Enable Go Modules (optional if using go.mod)
ENV GO111MODULE=on

# Download deps
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath \
    -ldflags="-s -w -X main.version=${VERSION} -X main.commit=${COMMIT} -X main.date=${DATE}" \
    -o /ugos-exporter ./exporter

FROM debian:bookworm-slim

ARG TARGETARCH

RUN apt-get update \
    && packages="ca-certificates" \
    && if [ "$TARGETARCH" = "amd64" ]; then packages="$packages intel-gpu-tools"; fi \
    && apt-get install --no-install-recommends -y $packages \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /ugos-exporter /usr/local/bin/ugos-exporter

EXPOSE 9877

ENTRYPOINT ["/usr/local/bin/ugos-exporter"]

