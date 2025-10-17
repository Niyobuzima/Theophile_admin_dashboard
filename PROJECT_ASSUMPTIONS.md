# Project Assumptions & Technical Reflections

## RSA Signature Implementation

While RSA-PSS signatures provide strong data integrity verification, they introduce operational complexity that becomes more apparent at scale. In this implementation, storing pre-computed hashes and signatures alongside user records works well for a small-to-medium dataset, but it creates long-term maintenance challenges. The biggest issue comes during key rotation, you need to track which keys were used to sign which data, essentially requiring a key versioning system. If you go with ephemeral signatures (computing them on-demand), you eliminate the storage overhead but add processing latency to every read operation.

## Protocol Buffers Trade-offs

This was my first real dive into protobuf, and I can see why it's popular for high-throughput systems. The binary serialization definitely reduces payload sizes compared to JSON, which is great for bandwidth and processing time when dealing with large datasets or streaming. However, the setup complexity is real, you need to install protobuf compilers, generate language-specific code, and keep schemas synchronized between services. The schema sharing requirement is probably the biggest pain point: if the backend and frontend are in separate repositories, you need a strategy for distributing the `.proto` files. Any schema change requires regenerating code on both sides, which can create deployment dependencies. For this admin dashboard with relatively small user lists, JSON would honestly be simpler and more debuggable. Protobuf shines when you're moving millions of records or building real-time streaming systems, but for CRUD operations with dozens or hundreds of users, the added complexity might not be worth it.

## Database Choice (SQLite)

SQLite works perfectly for development and testing, but it's not designed for concurrent writes or high-traffic production environments. The file-based nature makes it easy to get started without external dependencies, but you'd need to migrate to PostgreSQL or MySQL before scaling. The good news is Prisma makes that migration relatively painless—mostly just changing the datasource provider and connection string.

## Security Implementation

The combination of SHA-384 hashing and RSA-PSS signatures provides solid cryptographic guarantees, but it assumes the private key remains secure. In a real deployment, you'd want to use a hardware security module (HSM) or a cloud-based key management service instead of storing keys on the filesystem. The current approach with Helmet, rate limiting, and input sanitization is a good baseline, but production would need authentication (JWT), role-based access control, and proper audit logging.

## Frontend Signature Verification

Verifying signatures in the browser using the Web Crypto API is clever for demonstrating the cryptographic flow, but in practice, signature verification would typically happen on the backend. Client-side verification doesn't provide security—users can modify frontend code, but it's useful for data integrity checks and educational purposes.

## Docker Setup

The multi-stage Docker builds keep image sizes small, which is good for deployment speed. However, the current setup mounts the SQLite database as a volume, which wouldn't work well in a multi-container orchestration scenario. You'd need shared storage or, more likely, an external database service.

## Overall Architecture

The monorepo structure with separate backend and frontend folders works well for a test project and keeps everything version-controlled together. For a larger team, you might split these into separate repositories with their own CI/CD pipelines. The NestJS modular architecture is solid and would scale well—adding new features like JWT authentication or file uploads would follow the same pattern of creating dedicated modules.

## Development Experience

The combination of TypeScript across the full stack provides excellent type safety and developer experience. The Prisma ORM eliminates a lot of SQL boilerplate while still giving you control when needed. Hot reload in both NestJS and Next.js makes development fast and iterative.
