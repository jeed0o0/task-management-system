import { describe, it, expect } from "vitest";

describe("Tasks Service", () => {
  it("should validate task creation input", () => {
    const { createTaskSchema } = require("../src/validators/task.validator");
    const valid = createTaskSchema.safeParse({ title: "Test task" });
    expect(valid.success).toBe(true);

    const invalid = createTaskSchema.safeParse({});
    expect(invalid.success).toBe(false);
  });

  it("should reject empty title", () => {
    const { createTaskSchema } = require("../src/validators/task.validator");
    const result = createTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });
});
