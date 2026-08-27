import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockApi } from '../../mock/api';
import type { ChatMessage, OcrResult } from '../../types';

interface AiState {
  messages: ChatMessage[];
  assistantTyping: boolean;
  listening: boolean;
  ocr: OcrResult | null;
  scanning: boolean;
  error: string | null;
}

const initialState: AiState = {
  messages: [],
  assistantTyping: false,
  listening: false,
  ocr: null,
  scanning: false,
  error: null,
};

export const seedChat = createAsyncThunk('ai/seedChat', () => mockApi.seedChat());

export const askAssistant = createAsyncThunk('ai/ask', (question: string) => mockApi.askAssistant(question));

export const runOcr = createAsyncThunk('ai/runOcr', () => mockApi.runOcr());

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    pushUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        id: `msg-${Date.now()}`,
        author: 'user',
        text: action.payload,
        createdAt: new Date().toISOString(),
      });
    },
    setListening(state, action: PayloadAction<boolean>) {
      state.listening = action.payload;
    },
    clearOcr(state) {
      state.ocr = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(seedChat.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(askAssistant.pending, (state) => {
        state.assistantTyping = true;
      })
      .addCase(askAssistant.fulfilled, (state, action) => {
        state.assistantTyping = false;
        state.messages.push(action.payload);
      })
      .addCase(askAssistant.rejected, (state, action) => {
        state.assistantTyping = false;
        state.error = action.error.message ?? 'Assistant unavailable';
      })
      .addCase(runOcr.pending, (state) => {
        state.scanning = true;
        state.ocr = null;
      })
      .addCase(runOcr.fulfilled, (state, action) => {
        state.scanning = false;
        state.ocr = action.payload;
      })
      .addCase(runOcr.rejected, (state, action) => {
        state.scanning = false;
        state.error = action.error.message ?? 'Scan failed';
      });
  },
});

export const { pushUserMessage, setListening, clearOcr } = aiSlice.actions;
export default aiSlice.reducer;
