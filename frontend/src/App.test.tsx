import {describe, expect, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import App from "./App"

describe("Accordion test", () => {
    test("should show title all the time", () => {

        render(<App></App>);

        expect(screen.getByText(/Testing/i)).toBeDefined()
    })
})