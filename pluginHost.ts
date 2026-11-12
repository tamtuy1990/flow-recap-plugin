import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Flow } from 'flow-sdk';
import * as constants from '../constants';
import * as audioSynthesizer from './audioSynthesizer';
import * as entityResolutionService from './entityResolutionService';
import * as ffmpegService from './ffmpegService';
import * as geminiService from './geminiService';
import * as pipelineRunnerService from './pipelineRunnerService';
import * as projectStorageService from './projectStorageService';
import * as promptComposer from './promptComposer';
import * as storyboardGraphService from './storyboardGraphService';
import * as voiceInference from './voiceInference';

// Viết cứng: ai mở tool cũng chạy code ở địa chỉ này — không cho nhập từ giao diện.
export const PLUGIN_URL = 'https://raw.githubusercontent.com/tamtuy1990/flow-recap-plugin/main/plugin.js';

export type PluginCleanup = (() => void) | void;

export async function mountPlugin(container: HTMLElement, app: Record<string, unknown>): Promise<PluginCleanup> {
  // shortcut: CDN của raw.githubusercontent giữ bản cũ tối đa ~5 phút, ?t= để lách; cần tức thì thì ghim commit.
  const res = await fetch(`${PLUGIN_URL}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Không tải được plugin (HTTP ${res.status})`);
  // raw.githubusercontent trả text/plain nên không import() thẳng được — bọc qua Blob.
  const blobUrl = URL.createObjectURL(new Blob([await res.text()], { type: 'text/javascript' }));
  try {
    const mod = await import(/* @vite-ignore */ blobUrl);
    if (typeof mod.mount !== 'function') throw new Error('plugin.js thiếu hàm mount(container, host)');
    return mod.mount(container, {
      Flow,
      React,
      ReactDOM,
      app,
      services: {
        constants,
        audioSynthesizer,
        entityResolutionService,
        ffmpegService,
        geminiService,
        pipelineRunnerService,
        projectStorageService,
        promptComposer,
        storyboardGraphService,
        voiceInference,
      },
    });
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}
