const id = process.env.CHROME_EX || "";

export const CONTENT = `content${id}`;
export const INCLUDE = `include${id}`;
export const BACKGROUND = `background${id}`;

export const INCLUDE_SEND = `chromex--${INCLUDE}--send-message`;
export const CONTENT_SEND = `chromex--${CONTENT}--send-message`;
