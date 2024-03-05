import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [MatProgressSpinnerModule, FormsModule],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  describe('Home layout', () => {
    it('should render title', waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain(
        'Start Interacting with the Kadena Blockchain',
      );
    }));

    it('should render blockchain interaction section', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('h4')[0].textContent).toContain(
        'Write to the blockchain',
      );
      expect(compiled.querySelectorAll('h4')[1].textContent).toContain(
        'Read from the blockchain',
      );
    });

    it('should render resources section', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelectorAll('h4')[2].textContent).toContain(
        'Resources',
      );
    });
  });

  describe('Blockchain interaction', () => {
    it('should contain disabled read and write buttons', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;

      // Verify that the buttons are disabled
      expect(compiled.querySelectorAll('button')[0].disabled).toBeTruthy();
      expect(compiled.querySelectorAll('button')[1].disabled).toBeTruthy();
    });

    it('should enable read button after entering account', () => {
      const account = 'k:account';
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      const readButton = compiled.querySelectorAll('button')[1];

      // Verify that the read button is disabled
      expect(readButton.disabled).toBeTruthy();

      const accountInput = compiled.querySelector('#account');
      accountInput.value = account;
      accountInput.dispatchEvent(new Event('input'));

      fixture.whenStable().then(() => {
        // Verify that the read button is enabled
        expect(readButton.disabled).toBeFalsy();
      });
    });

    it('should enable write button after entering account and message', () => {
      const account = 'k:account';
      const message = 'My message';
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      const writeButton = compiled.querySelectorAll('button')[0];

      // Verify that the write button is disabled
      expect(writeButton.disabled).toBeTruthy();

      const accountInput = compiled.querySelector('#account');
      accountInput.value = account;
      accountInput.dispatchEvent(new Event('input'));

      const messageInput = compiled.querySelector('#messageToWrite');
      messageInput.value = message;
      messageInput.dispatchEvent(new Event('input'));

      fixture.whenStable().then(() => {
        // Verify that the write button is enabled
        expect(writeButton.disabled).toBeFalsy();
      });
    });
  });
});
