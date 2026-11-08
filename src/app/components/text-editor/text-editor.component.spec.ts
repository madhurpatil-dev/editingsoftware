import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TextEditorComponent } from './text-editor.component';

describe('TextEditorComponent', () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;

  beforeEach(async () => {
    localStorage.removeItem('content');
    localStorage.removeItem('documentTitle');
    localStorage.removeItem('lastSavedAt');
    await TestBed.configureTestingModule({
      declarations: [TextEditorComponent],
      imports: [CommonModule, MatIconModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('counts words, characters, and reading time from the editor text', () => {
    expect(component.getWordCount()).toBe(0);
    expect(component.getReadingTime()).toBe(0);

    component.editor.nativeElement.innerText = '  Write something\nworth keeping.  ';

    expect(component.getWordCount()).toBe(4);
    expect(component.getCharacterCount()).toBe(component.editor.nativeElement.innerText.length);
    expect(component.getReadingTime()).toBe(1);
  });

  it('saves the document and its title locally', () => {
    component.editor.nativeElement.innerHTML = '<p>A saved note.</p>';
    component.documentTitle = 'My note';

    component.saveContent();

    expect(localStorage.getItem('content')).toBe('<p>A saved note.</p>');
    expect(localStorage.getItem('documentTitle')).toBe('My note');
    expect(component.saveStatus).toBe('Saved locally');
  });

  it('automatically saves after editing pauses', fakeAsync(() => {
    component.editor.nativeElement.innerHTML = '<p>Draft</p>';
    component.onEditorInput();
    expect(component.saveStatus).toBe('Saving…');

    tick(800);

    expect(localStorage.getItem('content')).toBe('<p>Draft</p>');
    expect(component.saveStatus).toBe('Saved locally');
  }));

  it('saves with Ctrl+S and Command+S', () => {
    spyOn(component, 'saveContent');
    const controlEvent = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, cancelable: true });
    const commandEvent = new KeyboardEvent('keydown', { key: 's', metaKey: true, cancelable: true });

    component.handleKeyboardEvent(controlEvent);
    component.handleKeyboardEvent(commandEvent);

    expect(component.saveContent).toHaveBeenCalledTimes(2);
    expect(controlEvent.defaultPrevented).toBeTrue();
    expect(commandEvent.defaultPrevented).toBeTrue();
  });

  it('toggles read-only state', () => {
    component.toggleReadOnly();
    fixture.detectChanges();

    expect(component.isReadOnly).toBeTrue();
    expect(fixture.nativeElement.querySelector('.editor').getAttribute('contenteditable')).toBe('false');
  });

  it('creates safe download filenames from the document title', () => {
    component.documentTitle = 'Notes: week one?';

    expect(component.getSafeFileName('txt')).toBe('Notes-week-one.txt');
  });
});
