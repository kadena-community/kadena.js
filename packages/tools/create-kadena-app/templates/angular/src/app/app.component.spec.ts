import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';
import '../test-setup';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;
  let mockAppService: jasmine.SpyObj<AppService>;

  beforeEach(waitForAsync(() => {
    const appServiceSpy = jasmine.createSpyObj('AppService', ['writeMessage', 'readMessage']);
    
    // Mock WalletAdapterClient constructor and methods
    spyOn(WalletAdapterClient.prototype, 'init').and.returnValue(Promise.resolve());
    spyOn(WalletAdapterClient.prototype, 'connect').and.returnValue(
      Promise.resolve({
        accountName: 'k:test-account',
        keyset: { keys: [], pred: 'keys-all' },
        existsOnChains: [],
        networkId: 'testnet04',
        contract: 'coin',
        guard: { keys: [], pred: 'keys-all' },
      } as any),
    );
    spyOn(WalletAdapterClient.prototype, 'isDetected').and.returnValue(true);
    spyOn(WalletAdapterClient.prototype, 'getActiveNetwork').and.returnValue(
      Promise.resolve({
        network: 'testnet04',
        chainId: '1',
        networkName: 'Kadena Testnet',
        networkId: 'testnet04',
      } as any),
    );
    
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [MatProgressSpinnerModule, FormsModule],
      providers: [
        { provide: AppService, useValue: appServiceSpy }
      ]
    }).compileComponents();

    mockAppService = TestBed.inject(AppService) as jasmine.SpyObj<AppService>;
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
      const buttons = compiled.querySelectorAll('button');
      expect(buttons[0].textContent).toContain('Connect Wallet');
    });

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
      const component = fixture.componentInstance;
      const buttons = Array.from(compiled.querySelectorAll('button'));
      const writeBtn = buttons.find((b) => b.textContent?.trim() === 'Write')!;

      // Set values directly on component to trigger Angular binding
      component.account = 'k:account';
      component.messageToWrite = 'My message';
      component.selectedWallet = 'Ecko Wallet';

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(writeBtn.disabled).toBeFalse();
      });
    }));
  });

  describe('Wallet connection', () => {
    it('should have wallet selection dropdown', () => {
      const walletSelect = compiled.querySelector('#wallet-select') as HTMLSelectElement;
      expect(walletSelect).toBeTruthy();
    });

    it('should connect to wallet when Connect Wallet is clicked', waitForAsync(() => {
      const component = fixture.componentInstance;
      component.selectedWallet = 'Ecko Wallet';
      component.loading = false;
      component.account = ''; // Make sure account is empty so button is enabled

      fixture.detectChanges(); // Update the DOM

      const connectBtn = Array.from(compiled.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Connect Wallet',
      )!;

      spyOn(component, 'connectWallet').and.callThrough();

      connectBtn.click();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.connectWallet).toHaveBeenCalled();
      });
    }));

    it('should update account when wallet is connected', waitForAsync(() => {
      const component = fixture.componentInstance;
      component.selectedWallet = 'Ecko Wallet';

      // Call the actual connectWallet method which will use our mocked WalletAdapterClient
      component.connectWallet().then(() => {
        fixture.detectChanges();
        expect(component.account).toBeTruthy();
      });
    }));
  });
});
