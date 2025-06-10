type TestGlobal = typeof globalThis & { prismaGlobal?: unknown };

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: class {
      $connect = jest.fn();
      $disconnect = jest.fn();
    }
  };
});

describe("db.ts", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalGlobal: typeof globalThis;

  beforeEach(() => {
    jest.resetModules();
    originalEnv = { ...process.env };
    originalGlobal = { ...globalThis };
  });

  afterEach(() => {
    process.env = originalEnv;
    Object.keys(globalThis).forEach((key) => {
      // @ts-expect-error Suppress error thrown when globalThis props are deleted
      delete globalThis[key];
    });
    Object.assign(globalThis, originalGlobal);
    jest.clearAllMocks();
  });

  it("should use globalThis.prismaGlobal if defined", () => {
    const fakePrisma = { test: "global" };
    // @ts-expect-error Suppress error
    globalThis.prismaGlobal = fakePrisma;
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const prisma = require("./db").default;
    expect(prisma).toBe(fakePrisma);
  });

  it("should call prismaClientSingleton if globalThis.prismaGlobal is undefined", () => {
    // @ts-expect-error Suppress error
    delete globalThis.prismaGlobal;
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const prisma = require("./db").default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require("@prisma/client");
    expect(prisma).toBeInstanceOf(PrismaClient);
    });

  it("should set globalThis.prismaGlobal in non-production", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
        value: "development",
        writable: true,
        configurable: true,
    });
    // @ts-expect-error Suppress error
    delete globalThis.prismaGlobal;
    jest.resetModules();
    require("./db");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require("@prisma/client");
    expect((globalThis as TestGlobal).prismaGlobal).toBeInstanceOf(PrismaClient);
    });

  it("should not set globalThis.prismaGlobal in production", () => {
    Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        writable: true,
        configurable: true,
        });
    // @ts-expect-error Suppress error
    delete globalThis.prismaGlobal;
    jest.resetModules();
    require("./db");
    expect((globalThis as TestGlobal).prismaGlobal).toBeUndefined();
  });
});