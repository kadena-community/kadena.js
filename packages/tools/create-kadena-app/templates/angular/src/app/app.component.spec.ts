import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [MatProgressSpinnerModule, FormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('Home layout', () => {
    it('should render title', () => {
      const h1 = compiled.querySelector('h1')!;
      expect(h1.textContent).toContain(
        'Start Interacting with the Kadena Blockchain',
      );
    });

     it('should render the wallet connection section', () => {
      const h4s = compiled.querySelectorAll('h4');
      expect(h4s[0].textContent).toContain('Wallet');
     });

    it('should render the wallet connection button', () => {
      it('should render blockchain interaction section', () => {
          const h4s = compiled.querySelectorAll('h4');
      // [0] is "Wallet"
      expect(h4s[1].textContent).toContain('Write to the blockchain');
      expect(h4s[2].textContent).toContain('Read from the blockchain');
    });

    it('should render resources section', () => {
      const h4s = compiled.querySelectorAll('h4');
      expect(h4s[3].textContent).toContain('Resources');
    });
  });

  describe('Blockchain interaction', () => {
    it('should contain disabled read and write buttons', () => {
      const buttons = Array.from(compiled.querySelectorAll('button'));
      const writeBtn = buttons.find((b) => b.textContent?.trim() === 'Write')!;
      const readBtn = buttons.find((b) => b.textContent?.trim() === 'Read')!;
      expect(writeBtn.disabled).toBeTrue();
      expect(readBtn.disabled).toBeTrue();
    });

    it('should enable read button after entering account', waitForAsync(() => {
      const buttons = Array.from(compiled.querySelectorAll('button'));
      const readBtn = buttons.find((b) => b.textContent?.trim() === 'Read')!;
      const accountInput = compiled.querySelector(
        '#account',
      ) as HTMLTextAreaElement;

      accountInput.value = 'k:account';
      accountInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(readBtn.disabled).toBeFalse();
      });
    }));

    it('should enable write button after entering account and message', waitForAsync(() => {
      const buttons = Array.from(compiled.querySelectorAll('button'));
      const writeBtn = buttons.find((b) => b.textContent?.trim() === 'Write')!;
      const accountInput = compiled.querySelector(
        '#account',
      ) as HTMLTextAreaElement;
      const messageInput = compiled.querySelector(
        '#messageToWrite',
      ) as HTMLTextAreaElement;

      accountInput.value = 'k:account';
      accountInput.dispatchEvent(new Event('input'));

      messageInput.value = 'My message';
      messageInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(writeBtn.disabled).toBeFalse();
      });
    }));
  });
  });
