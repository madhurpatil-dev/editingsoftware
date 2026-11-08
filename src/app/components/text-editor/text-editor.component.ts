import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ColorEvent } from 'ngx-color';
import Swal from 'sweetalert2';

interface VoiceRecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}

interface VoiceRecognitionEvent extends Event {
  resultIndex: number;
  results: ArrayLike<VoiceRecognitionResult>;
}

interface VoiceRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: VoiceRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type VoiceRecognitionConstructor = new () => VoiceRecognition;

@Component({
  selector: 'app-text-editor',
  standalone: false,
  templateUrl: './text-editor.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  content: string = '';
  documentTitle = 'Untitled document';
  saveStatus = 'Saved locally';
  lastSavedAt: Date | null = null;
  isReadOnly = false;
  shortcuts: { [key: string]: () => void } = {
    'Ctrl+s': () => this.saveContent(),
  };
  recognition: VoiceRecognition | null = null;
  isVoiceTyping: boolean = false;
  private autosaveTimeout: ReturnType<typeof setTimeout> | null = null;
  private savedRange: Range | null = null;
  private readonly onVoicesChanged = () => this.loadVoices();
  emojis: string[] = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😝',
    '😜',
    '🤪',
    '🤨',
    '🧐',
    '🤓',
    '😎',
    '🤩',
    '🥳',
    '😏',
    '😒',
    '😞',
    '😔',
    '😟',
    '😕',
    '🙁',
    '☹️',
    '😣',
    '😖',
    '😫',
    '😩',
    '🥺',
    '😢',
    '😭',
    '😤',
    '😠',
    '😡',
    '🤬',
    '🤯',
    '😳',
    '🥵',
    '🥶',
    '😱',
    '😨',
    '😰',
    '😥',
    '😓',
    '🤗',
    '🤔',
    '🤭',
    '🤫',
    '🤥',
    '😶',
    '😐',
    '😑',
    '😬',
    '🙄',
    '😯',
    '😦',
    '😧',
    '😮',
    '😲',
    '🥱',
    '😴',
    '🤤',
    '😪',
    '😵',
    '🤐',
    '🥴',
    '🤢',
    '🤮',
    '🤧',
    '😷',
    '🤒',
    '🤕',
    '🤑',
    '🤠',
    '😈',
    '👿',
    '👹',
    '👺',
    '🤡',
    '💩',
    '👻',
    '💀',
    '☠️',
    '👽',
    '👾',
    '🤖',
    '🎃',
    '😺',
    '😸',
    '😹',
    '😻',
    '😼',
    '😽',
    '🙀',
    '😿',
    '😾',
    '👋',
    '🤚',
    '🖐',
    '✋',
    '🖖',
    '👌',
    '🤏',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '☝️',
    '👍',
    '👎',
    '✊',
    '👊',
    '🤛',
    '🤜',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍️',
    '💅',
    '🤳',
    '💪',
    '🦾',
    '🦵',
    '🦿',
    '🦶',
    '👣',
    '👀',
    '👁',
    '🧠',
    '🦷',
    '🦴',
    '👅',
    '👄',
    '💋',
    '🩸',
    '🍏',
    '🍎',
    '🍐',
    '🍊',
    '🍋',
    '🍌',
    '🍉',
    '🍇',
    '🍓',
    '🍈',
    '🍒',
    '🍑',
    '🥭',
    '🍍',
    '🥥',
    '🥝',
    '🍅',
    '🍆',
    '🥑',
    '🥦',
    '🥬',
    '🥒',
    '🌶',
    '🌽',
    '🥕',
    '🧄',
    '🧅',
    '🥔',
    '🍠',
    '🥐',
    '🥯',
    '🍞',
    '🥖',
    '🥨',
    '🧀',
    '🥚',
    '🍳',
    '🧈',
    '🥞',
    '🧇',
    '🥓',
    '🥩',
    '🍗',
    '🍖',
    '🦴',
    '🌭',
    '🍔',
    '🍟',
    '🍕',
    '🥪',
    '🥙',
    '🧆',
    '🌮',
    '🌯',
    '🥗',
    '🥘',
    '🥫',
    '🍝',
    '🍜',
    '🍲',
    '🍛',
    '🍣',
    '🍱',
    '🥟',
    '🦪',
    '🍤',
    '🍙',
    '🍚',
    '🍘',
    '🍥',
    '🥠',
    '🥮',
    '🍢',
    '🍡',
    '🍧',
    '🍨',
    '🍦',
    '🥧',
    '🧁',
    '🍰',
    '🎂',
    '🍮',
    '🍭',
    '🍬',
    '🍫',
    '🍿',
    '🍩',
    '🍪',
    '🌰',
    '🥜',
    '🍯',
    '🥛',
    '🍼',
    '☕️',
    '🍵',
    '🧃',
    '🥤',
    '🍶',
    '🍺',
    '🍻',
    '🥂',
    '🍷',
    '🥃',
    '🍸',
    '🍹',
    '🧉',
    '🍾',
    '🧊',
    '🥄',
    '🍴',
    '🍽',
    '🥣',
    '🥡',
    '🥢',
    '🧂',
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
    '💟',
    '☮️',
    '✝️',
    '☪️',
    '🕉',
    '☸️',
    '✡️',
    '🔯',
    '🕎',
    '☯️',
    '☦️',
    '🛐',
    '⛎',
    '♈️',
    '♉️',
    '♊️',
    '♋️',
    '♌️',
    '♍️',
    '♎️',
    '♏️',
    '♐️',
    '♑️',
    '♒️',
    '♓️',
    '🆔',
    '⚛️',
    '🉑',
    '☢️',
    '☣️',
    '📴',
    '📳',
    '🈶',
    '🈚️',
    '🈸',
    '🈺',
    '🈷️',
    '✴️',
    '🆚',
    '💮',
    '🉐',
    '㊙️',
    '㊗️',
    '🈴',
    '🈵',
    '🈹',
    '🈲',
    '🅰️',
    '🅱️',
    '🆎',
    '🆑',
    '🅾️',
    '🆘',
    '❌',
    '⭕️',
    '🛑',
    '⛔️',
    '📛',
    '🚫',
    '💯',
    '💢',
    '♨️',
    '🚷',
    '🚯',
    '🚳',
    '🚱',
    '🔞',
    '📵',
    '🚭',
    '❗️',
    '❕',
    '❓',
    '❔',
    '‼️',
    '⁉️',
    '🔅',
    '🔆',
    '〽️',
    '⚠️',
    '🚸',
    '🔱',
    '⚜️',
    '🔰',
    '♻️',
    '✅',
    '🈯️',
    '💹',
    '❇️',
    '✳️',
    '❎',
    '🌐',
    '💠',
    'Ⓜ️',
    '🌀',
    '💤',
    '🏧',
    '🚾',
    '♿️',
    '🅿️',
    '🛗',
    '🈳',
    '🈂️',
    '🛂',
    '🛃',
    '🛄',
    '🛅',
    '🚹',
    '🚺',
    '🚼',
    '⚧',
    '🚻',
    '🚮',
    '🎦',
    '📶',
    '🈁',
    '🔣',
    'ℹ️',
    '🔤',
    '🔡',
    '🔠',
    '🆖',
    '🆗',
    '🆙',
    '🆒',
    '🆕',
    '🆓',
    '0️⃣',
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '🔟',
    '🔢',
    '#️⃣',
    '*️⃣',
    '⏏️',
    '▶️',
    '⏸',
    '⏯',
    '⏹',
    '⏺',
    '⏭',
    '⏮',
    '⏩',
    '⏪',
    '⏫',
    '⏬',
    '◀️',
    '🔼',
    '🔽',
    '➡️',
    '⬅️',
    '⬆️',
    '⬇️',
    '↗️',
    '↘️',
    '↙️',
    '↖️',
    '↕️',
    '↔️',
    '↪️',
    '↩️',
    '⤴️',
    '⤵️',
    '🔀',
    '🔁',
    '🔂',
    '🔄',
    '🔃',
    '🎵',
    '🎶',
    '➕',
    '➖',
    '➗',
    '✖️',
    '♾',
    '💲',
    '💱',
    '™️',
    '©️',
    '®️',
    '〰️',
    '➰',
    '➿',
    '🔚',
    '🔙',
    '🔛',
    '🔝',
    '🔜',
    '✔️',
    '☑️',
    '🔘',
    '🔴',
    '🟠',
    '🟡',
    '🟢',
    '🔵',
    '🟣',
    '⚫️',
    '⚪️',
    '🟤',
    '🔺',
    '🔻',
    '🔸',
    '🔹',
    '🔶',
    '🔷',
    '🔳',
    '🔲',
    '▪️',
    '▫️',
    '◾️',
    '◽️',
    '◼️',
    '◻️',
    '🟥',
    '🟧',
    '🟨',
    '🟩',
    '🟦',
    '🟪',
    '⬛️',
    '⬜️',
    '🟫',
    '🔈',
    '🔇',
    '🔉',
    '🔊',
    '🔔',
    '🔕',
    '📣',
    '📢',
    '👁‍🗨',
    '💬',
    '💭',
    '🗯',
    '♠️',
    '♣️',
    '♥️',
    '♦️',
    '🃏',
    '🎴',
    '🀄️',
    '🕐',
    '🕑',
    '🕒',
    '🕓',
    '🕔',
    '🕕',
    '🕖',
    '🕗',
    '🕘',
    '🕙',
    '🕚',
    '🕛',
    '🕜',
    '🕝',
    '🕞',
    '🕟',
    '🕠',
    '🕡',
    '🕢',
    '🕣',
    '🕤',
    '🕥',
    '🕦',
    '🕧',
  ];
  showHighlightOptions: boolean = false;

  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  isReading: boolean = false;
  private speechSynthesis?: SpeechSynthesis;
  private speechUtterance: SpeechSynthesisUtterance | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    this.speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  }

  ngOnInit(): void {
    this.loadContent();
    this.loadVoices();
    this.speechSynthesis?.addEventListener('voiceschanged', this.onVoicesChanged);
  }

  ngOnDestroy(): void {
    if (this.autosaveTimeout) {
      this.saveContent();
    }
    this.speechSynthesis?.removeEventListener('voiceschanged', this.onVoicesChanged);
    this.stopReading();
    if (this.isVoiceTyping) {
      this.recognition?.stop();
    }
  }

  loadVoices(): void {
    if (!this.speechSynthesis) {
      return;
    }
    this.availableVoices = this.speechSynthesis.getVoices();

    if (this.availableVoices.length > 0) {
      this.selectedVoice = this.availableVoices[0];
    }

    this.cdr.detectChanges();
  }

  startReading(): void {
    const text = this.editor.nativeElement.innerText.trim();
    if (!text) {
      return;
    }
    if (!this.speechSynthesis) {
      Swal.fire({ icon: 'info', title: 'Read aloud is not supported in this browser.' });
      return;
    }

    this.speechUtterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      this.speechUtterance.voice = this.selectedVoice;
    }
    this.speechUtterance.onend = () => {
      this.isReading = false;
      this.cdr.detectChanges();
    };

    this.speechSynthesis.speak(this.speechUtterance);
    this.isReading = true;
  }

  stopReading(): void {
    if (this.isReading && this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isReading = false;
    }
  }

  changeVoice(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVoiceName = selectElement.value;
    this.selectedVoice = this.availableVoices.find(voice => voice.name === selectedVoiceName) || null;
  }

  format(command: string, value: string = ''): void {
    if (this.isReadOnly) {
      return;
    }
    this.restoreSelection();
    document.execCommand(command, false, value);
    this.onEditorInput();
    this.rememberSelection();
  }

  saveContent(): void {
    this.content = this.editor.nativeElement.innerHTML;
    try {
      localStorage.setItem('content', this.content);
      localStorage.setItem('documentTitle', this.documentTitle.trim() || 'Untitled document');
      localStorage.setItem('lastSavedAt', new Date().toISOString());
      this.documentTitle = this.documentTitle.trim() || 'Untitled document';
      this.lastSavedAt = new Date();
      this.saveStatus = 'Saved locally';
      if (this.autosaveTimeout) {
        clearTimeout(this.autosaveTimeout);
        this.autosaveTimeout = null;
      }
    } catch (error) {
      this.saveStatus = 'Unable to save';
      console.error('Unable to save the document to local storage.', error);
      Swal.fire({ icon: 'error', title: 'Could not save your document', text: 'Check your browser storage settings and try again.' });
    }
  }

  loadContent(): void {
    try {
      const savedContent = localStorage.getItem('content');
      const savedTitle = localStorage.getItem('documentTitle');
      const savedAt = localStorage.getItem('lastSavedAt');
      if (savedContent !== null) {
        this.content = savedContent;
        this.editor.nativeElement.innerHTML = savedContent;
      }
      if (savedTitle) {
        this.documentTitle = savedTitle;
      }
      if (savedAt) {
        const savedDate = new Date(savedAt);
        this.lastSavedAt = Number.isNaN(savedDate.getTime()) ? null : savedDate;
      }
    } catch (error) {
      this.saveStatus = 'Storage unavailable';
      console.error('Unable to load the saved document from local storage.', error);
    }
  }

  onEditorInput(): void {
    this.content = this.editor.nativeElement.innerHTML;
    this.saveStatus = 'Unsaved changes';
    this.scheduleAutoSave();
  }

  updateDocumentTitle(event: Event): void {
    this.documentTitle = (event.target as HTMLInputElement).value;
    this.saveStatus = 'Unsaved changes';
    this.scheduleAutoSave();
  }

  get hasContent(): boolean {
    return this.editor?.nativeElement.innerHTML.trim().length > 0;
  }

  scheduleAutoSave(): void {
    if (this.autosaveTimeout) {
      clearTimeout(this.autosaveTimeout);
    }
    this.saveStatus = 'Saving…';
    this.autosaveTimeout = setTimeout(() => this.saveContent(), 800);
  }

  getWordCount(): number {
    const text = this.editor?.nativeElement.innerText ?? '';
    const words = text.trim();
    return words ? words.split(/\s+/).length : 0;
  }

  getCharacterCount(): number {
    return (this.editor?.nativeElement.innerText ?? '').length;
  }

  getReadingTime(): number {
    const words = this.getWordCount();
    return words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
  }

  getSafeFileName(extension: string): string {
    const baseName = this.documentTitle
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80) || 'document';
    return `${baseName}.${extension}`;
  }

  async clearDocument(): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Clear this document?',
      text: 'This will remove the current document from this browser.',
      showCancelButton: true,
      confirmButtonText: 'Clear document',
      cancelButtonText: 'Keep writing',
    });
    if (!result.isConfirmed) {
      return;
    }

    this.editor.nativeElement.innerHTML = '';
    this.documentTitle = 'Untitled document';
    this.onEditorInput();
  }

  async copyAsText(): Promise<void> {
    const text = this.editor.nativeElement.innerText;
    try {
      await navigator.clipboard.writeText(text);
      await Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Text copied', showConfirmButton: false, timer: 1400 });
    } catch (error) {
      console.error('Unable to copy the document to the clipboard.', error);
      Swal.fire({ icon: 'error', title: 'Could not copy text', text: 'Clipboard access is unavailable in this browser.' });
    }
  }

  @HostListener('document:selectionchange')
  rememberSelection(): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount || !this.editor?.nativeElement) {
      return;
    }
    const range = selection.getRangeAt(0);
    if (this.editor.nativeElement.contains(range.commonAncestorContainer)) {
      this.savedRange = range.cloneRange();
    }
  }

  private restoreSelection(): void {
    this.editor.nativeElement.focus();
    if (!this.savedRange || !this.editor.nativeElement.contains(this.savedRange.commonAncestorContainer)) {
      return;
    }
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(this.savedRange);
  }

  alignText(align: 'left' | 'center' | 'right' | 'justify'): void {
    this.format(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
  }

  setHeading(heading: number): void {
    this.format('formatBlock', `<h${heading}>`);
  }

  toggleSubscript(): void {
    this.format('subscript');
  }

  toggleSuperscript(): void {
    this.format('superscript');
  }
  insertLineBreak(): void {
    this.format('insertHTML', '<br>');
  }

  toggleStrikethrough(): void {
    this.format('strikeThrough');
  }

  clearFormatting(): void {
    this.format('removeFormat');
  }

  indent(): void {
    this.format('indent');
  }

  outdent(): void {
    this.format('outdent');
  }

  insertHorizontalRule(): void {
    this.format('insertHorizontalRule');
  }

  insertLink(url: string): void {
    const selection = window.getSelection();
    if (selection) {
      const link = `<a href="${url}" target="_blank">${selection.toString()}</a>`;
      this.format('insertHTML', link);
    }
  }

  insertImage(url: string): void {
    const imageHtml = `<img src="${url}" alt="Image" style="max-width: 100%;">`;
    this.format('insertHTML', imageHtml);
  }

  setBackgroundColor(color: string): void {
    this.format('backColor', color);
  }

  setTextColor(color: string): void {
    this.format('foreColor', color);
  }

  toggleBlockquote(): void {
    this.format('formatBlock', '<blockquote>');
  }

  insertDate(): void {
    const date = new Date().toLocaleDateString();
    this.format('insertHTML', date);
  }

  insertTime(): void {
    const time = new Date().toLocaleTimeString();
    this.format('insertHTML', time);
  }

  insertEmail(email: string): void {
    const emailHtml = `<a href="mailto:${email}">${email}</a>`;
    this.format('insertHTML', emailHtml);
  }

  insertHorizontalLine(): void {
    const horizontalLine = '<hr>';
    this.format('insertHTML', horizontalLine);
  }

  toggleUnderline(): void {
    this.format('underline');
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      if (!this.editor.nativeElement.requestFullscreen) {
        return;
      }
      void this.editor.nativeElement.requestFullscreen().catch((error: unknown) => {
        console.error('Unable to enter fullscreen mode.', error);
      });
    } else if (document.exitFullscreen) {
      void document.exitFullscreen().catch((error: unknown) => {
        console.error('Unable to exit fullscreen mode.', error);
      });
    }
  }

  printContent(): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      Swal.fire({ icon: 'error', title: 'Printing was blocked', text: 'Allow pop-ups to print this document.' });
      return;
    }
    printWindow.document.write(`<html><head><title>${this.documentTitle}</title></head><body>${this.content}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  }

  downloadAsHTML(): void {
    const blob = new Blob([this.content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getSafeFileName('html');
    a.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 0);
  }

  downloadAsText(): void {
    const textContent = this.editor.nativeElement.innerText;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getSafeFileName('txt');
    a.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 0);
  }

  insertSpecialCharacter(character: string): void {
    this.format('insertText', character);
  }
  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  insertEmoji(emoji: string) {
    if (this.isReadOnly) {
      return;
    }
    this.restoreSelection();
    document.execCommand('insertText', false, emoji);
    this.onEditorInput();
    this.rememberSelection();
    this.showEmojiPicker = false;
  }

  toggleReadOnly(): void {
    this.isReadOnly = !this.isReadOnly;
  }

  toggleHighlight(): void {
    this.showHighlightOptions = !this.showHighlightOptions;
  }

  applyHighlight(color: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const currentColor = document.queryCommandValue('backColor');
      const newColor = currentColor === color ? 'transparent' : color;
      this.format('backColor', newColor);
    }
  }

  hideHighlightOptions(): void {
    this.showHighlightOptions = false;
  }

  handleColorChange($event: ColorEvent): void {
    this.applyHighlight($event.color.hex);
  }

  downloadAsPDF(): void {
    html2canvas(this.editor.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let remainingHeight = pdfHeight;
      let y = 0;
      while (remainingHeight > 0) {
        pdf.addImage(imgData, 'PNG', 0, y, pdfWidth, pdfHeight);
        remainingHeight -= pageHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
          y -= pageHeight;
        }
      }
      pdf.save(this.getSafeFileName('pdf'));
    }).catch((error: unknown) => {
      console.error('Unable to export the document as PDF.', error);
      Swal.fire({ icon: 'error', title: 'PDF export failed', text: 'Please try again.' });
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const keyCombo = `${event.ctrlKey || event.metaKey ? 'Ctrl+' : ''}${event.key.toLowerCase()}`;
    if (this.shortcuts[keyCombo]) {
      event.preventDefault();
      this.shortcuts[keyCombo]();
    }
  }

  // Voice Typing
  startVoiceTyping(): void {
    if (this.isReadOnly) {
      return;
    }
    if (!this.recognition) {
      const browserWindow = window as Window & {
        SpeechRecognition?: VoiceRecognitionConstructor;
        webkitSpeechRecognition?: VoiceRecognitionConstructor;
      };
      const Recognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
      if (!Recognition) {
        Swal.fire({ icon: 'info', title: 'Voice typing is not supported in this browser.' });
        return;
      }
      this.recognition = new Recognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: VoiceRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.restoreSelection();
            document.execCommand('insertText', false, event.results[i][0].transcript);
            this.onEditorInput();
          }
        }
        this.rememberSelection();
      };

      this.recognition.onerror = (event: Event & { error: string }) => {
        this.isVoiceTyping = false;
        console.error('Voice typing failed.', event.error);
      };

      this.recognition.onend = () => {
        this.isVoiceTyping = false;
        this.cdr.detectChanges();
      };
    }

    if (this.isVoiceTyping) {
      this.recognition.stop();
      this.isVoiceTyping = false;
    } else {
      this.recognition.start();
      this.isVoiceTyping = true;
    }
  }

  insertTableCaption(caption: string): void {
    const tableCaption = `<caption>${caption}</caption>`;
    const selection = window.getSelection();
    if (selection) {
      this.format('insertHTML', tableCaption);
    }
  }

  insertFootnote(): void {
    const selection = window.getSelection();
    if (selection) {
      const footnote = `<sup>[Footnote]</sup>`;
      this.format('insertHTML', footnote);
    }
  }

  openTableInputDialog(): void {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 1000;
    `;

    const dialog = document.createElement('dialog');
    dialog.style.cssText = `
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; /* Ensures the dialog takes the full height of the screen */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    margin-left:-100px;
  }
  `;

    dialog.innerHTML = `
      <style>
        .table-dialog {
          font-family: 'Arial', sans-serif;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 24px;
          width: 320px;
          border: none;
          margin: auto; /* Center the content inside the dialog */
        }
          @media screen and (max-width: 480px) {
          .table-dialog {
          font-family: "Arial", sans-serif;
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 26px;
          max-width: 320px;
          margin-right: 145px;
        }
  }

        .table-dialog h2 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
          @media screen and (max-width: 480px) {
        .table-dialog form {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
  }
        .table-dialog .input-group {
          margin-bottom: 16px;
        }
        .table-dialog label {
          display: block;
          margin-bottom: 8px;
          color: #34495e;
          font-weight: bold;
        }
        .table-dialog input[type="number"] {
          width: 100%;
          padding: 10px;
          border: 2px solid #bdc3c7;
          border-radius: 4px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }
        .table-dialog input[type="number"]:focus {
          border-color: #3498db;
          outline: none;
        }
        .table-dialog .button-group {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .table-dialog button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.1s ease;
        }
        .table-dialog button[type="submit"] {
          background-color: #2ecc71;
          color: white;
        }
        .table-dialog button[type="submit"]:hover {
          background-color: #27ae60;
        }
        .table-dialog button[type="button"] {
          background-color: #e74c3c;
          color: white;
        }
        .table-dialog button[type="button"]:hover {
          background-color: #c0392b;
        }
        .table-dialog button:active {
          transform: scale(0.98);
        }
      </style>
      <div class="table-dialog">
        <form method="dialog">
          <h2>Insert Table</h2>
          <div class="input-group">
            <label for="rows">Number of rows:</label>
            <input type="number" id="rows" name="rows" min="1" max="20" value="3" required>
          </div>
          <div class="input-group">
            <label for="cols">Number of columns:</label>
            <input type="number" id="cols" name="cols" min="1" max="20" value="3" required>
          </div>
          <div class="button-group">
            <button type="submit">Insert</button>
            <button type="button" id="cancelBtn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    const form = dialog.querySelector('form');
    const cancelBtn = dialog.querySelector('#cancelBtn');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const rows = (dialog.querySelector('#rows') as HTMLInputElement).value;
      const cols = (dialog.querySelector('#cols') as HTMLInputElement).value;
      dialog.close(`${rows},${cols}`);
    });

    cancelBtn?.addEventListener('click', () => {
      dialog.close();
    });

    dialog.showModal();

    dialog.addEventListener('close', () => {
      if (dialog.returnValue && dialog.returnValue !== 'null') {
        const [rows, cols] = dialog.returnValue.split(',');
        const parsedRows = parseInt(rows);
        const parsedCols = parseInt(cols);

        if (Number.isInteger(parsedRows) && Number.isInteger(parsedCols) &&
          parsedRows >= 1 && parsedRows <= 20 && parsedCols >= 1 && parsedCols <= 20) {
          let tableHtml = `
            <table class="custom-table" style="width: 100%; max-width: 100%; border-collapse: collapse; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr>`;
          for (let j = 0; j < parsedCols; j++) {
            tableHtml +=
              '<th style="border: 1px solid #ddd; padding: 12px; background-color: #f4f4f4;">Column</th>';
          }
          tableHtml += `
                </tr>
              </thead>
              <tbody>`;
          for (let i = 0; i < parsedRows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < parsedCols; j++) {
              tableHtml +=
                '<td style="border: 1px solid #ddd; padding: 12px; height: 40px;">&nbsp;</td>';
            }
            tableHtml += '</tr>';
          }
          tableHtml += `
              </tbody>
            </table>`;
          this.insertHtmlAtCursor(tableHtml); // Insert the table HTML into the editor
        } else {
            Swal.fire({ icon: 'warning', title: 'Choose between 1 and 20 rows and columns.' });
        }
      }
      document.body.removeChild(dialog);
      document.body.removeChild(overlay);
    });
  }

  insertHtmlAtCursor(html: string): void {
    if (this.isReadOnly) {
      return;
    }
    this.restoreSelection();
    const selection = window.getSelection();
    if (!selection) {
      return;
    }
    if (!selection.rangeCount || !this.editor.nativeElement.contains(selection.getRangeAt(0).commonAncestorContainer)) {
      const endRange = document.createRange();
      endRange.selectNodeContents(this.editor.nativeElement);
      endRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(endRange);
    }

    const range = selection.getRangeAt(0);
    const fragment = range.createContextualFragment(html);
    range.deleteContents();
    range.insertNode(fragment);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    this.editor.nativeElement.focus();
    this.onEditorInput();
    this.rememberSelection();
  }
}
