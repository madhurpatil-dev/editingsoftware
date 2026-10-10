import { OverlayRef, OverlayConfig, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ColorEvent } from 'ngx-color';
import Swal from 'sweetalert2';

export interface TableData {
  col1: string;
  col2: string;
}
interface Comment {
  text: string;
  range: Range;
}
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-text-editor',
  standalone: false,
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit {
  comments: any;
  alert() {
    throw new Error('Method not implemented.');
  }
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  content: string = '';
  shortcuts: { [key: string]: () => void } = {};
  recognition: any;
  isVoiceTyping: boolean = false;
  colors = [
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
  ];
  
  // In your component file
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
  highlightColor: string | null = null;
  isSpeaking: boolean = false;
  textToSpeak: string = '';

  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  isReading: boolean = false;
  private speechSynthesis: SpeechSynthesis;
  private speechUtterance: SpeechSynthesisUtterance | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    this.speechSynthesis = window.speechSynthesis;
  }
  ngOnInit(): void {
    this.loadContent();
    this.loadVoices();

    // Attempt to load voices immediately as well
    this.availableVoices = window.speechSynthesis.getVoices();
    if (this.availableVoices.length > 0) {
      this.selectedVoice = this.availableVoices[0];
    }
  }

  ngOnDestroy(): void {
    this.stopReading();
  }

  loadVoices(): void {
    console.log('Loading voices...');
    this.availableVoices = this.speechSynthesis.getVoices();

    console.log('Available voices:', this.availableVoices);

    if (this.availableVoices.length > 0) {
      this.selectedVoice = this.availableVoices[0];
    }

    this.cdr.detectChanges();
  }

  startReading(): void {
    if (!this.isReading) {
      const text = this.editor.nativeElement.innerText;
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
  }

  stopReading(): void {
    if (this.isReading) {
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
    document.execCommand(command, false, value);
  }

  saveContent(): void {
    this.content = this.editor.nativeElement.innerHTML;
    localStorage.setItem('content', this.content);

    Swal.fire({
      icon: 'success',
      title: 'Content saved!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  loadContent(): void {
    const savedContent = localStorage.getItem('content');
    if (savedContent) {
      this.content = savedContent;
      this.editor.nativeElement.innerHTML = savedContent;
    }
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
      this.editor.nativeElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  printContent(): void {
    const printWindow = window.open('', '_blank');
    printWindow!.document.write(`<html><body>${this.content}</body></html>`);
    printWindow!.document.close();
    printWindow!.print();
  }

  downloadAsHTML(): void {
    const blob = new Blob([this.content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.html';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadAsText(): void {
    const textContent = this.editor.nativeElement.innerText;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  insertSpecialCharacter(character: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(character));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (this.showEmojiPicker) {
      // If opening the picker, focus the editor
      this.editor.nativeElement.focus();
    }
  }

  openEmojiPicker() {
    this.showEmojiPicker = true;
    this.editor.nativeElement.focus();
  }

  closeEmojiPicker() {
    this.showEmojiPicker = false;
  }

  openEmojiPickerAndFocus() {
    this.openEmojiPicker();
    this.editor.nativeElement.focus();

    // Place cursor at the end if there's no selection
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      const range = document.createRange();
      range.selectNodeContents(this.editor.nativeElement);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  insertEmoji(emoji: string) {
    // Store the current selection
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    // Focus the editor
    this.editor.nativeElement.focus();

    // Restore the selection
    if (range) {
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    // Insert the emoji at the current cursor position
    document.execCommand('insertText', false, emoji);

    // Update content and trigger change detection
    this.content = this.editor.nativeElement.innerHTML;
    this.cdr.detectChanges();

    // Close emoji picker
    this.showEmojiPicker = false;
  }

  getWordCount(): number {
    const text = this.editor.nativeElement.innerText || '';
    return text.trim().split(/\s+/).length;
  }

  toggleReadOnly(): void {
    const contentEditable =
      this.editor.nativeElement.getAttribute('contenteditable');
    this.editor.nativeElement.setAttribute(
      'contenteditable',
      contentEditable === 'true' ? 'false' : 'true'
    );
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

  addComment(text: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const comment: Comment = { text, range };
      this.comments.push(comment);
    }
  }
  downloadAsPDF(): void {
    html2canvas(this.editor.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('content.pdf');
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const keyCombo = `${event.ctrlKey ? 'Ctrl+' : ''}${event.key}`;
    if (this.shortcuts[keyCombo]) {
      event.preventDefault();
      this.shortcuts[keyCombo]();
    }
  }

  autoSave(): void {
    setInterval(() => {
      this.saveContent();
    }, 300000);
  }
  versionHistory: string[] = [];
  revertToVersion(index: number): void {
    if (this.versionHistory[index]) {
      this.content = this.versionHistory[index];
      this.editor.nativeElement.innerHTML = this.content;
    }
  }

  // Voice Typing
  startVoiceTyping(): void {
    if (!this.recognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.editor.nativeElement.innerHTML +=
              event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error(event.error);
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
            <input type="number" id="rows" name="rows" min="1" value="3" required>
          </div>
          <div class="input-group">
            <label for="cols">Number of columns:</label>
            <input type="number" id="cols" name="cols" min="1" value="3" required>
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

        if (!isNaN(parsedRows) && !isNaN(parsedCols)) {
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
        }
      }
      document.body.removeChild(dialog);
      document.body.removeChild(overlay);
    });
  }

  insertHtmlAtCursor(html: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Check if the selection is within the editor
      if (this.editor.nativeElement.contains(range.commonAncestorContainer)) {
        const fragment = range.createContextualFragment(html);
        range.deleteContents();
        range.insertNode(fragment);

        // Move the cursor to the end of the inserted content
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // If the selection is not in the editor, append the content at the end
        const fragment = document.createRange().createContextualFragment(html);
        this.editor.nativeElement.appendChild(fragment);
      }

      // Ensure the editor gets focus
      this.editor.nativeElement.focus();
    }
  }
}
