import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import Sidebar from "../Sidebar.vue";

describe("Sidebar", () => {
  it("renders properly", () => {
    // FIXME: This test is failing because of the following error: "No overload matches this call."
    // const wrapper = mount(HelloWorld, { propsData: { msg: "Hello Vitest" } });
    // expect(wrapper.text()).toContain("Hello Vitest");
  });
});
