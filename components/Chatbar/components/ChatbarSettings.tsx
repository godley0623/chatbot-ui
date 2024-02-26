import { IconExclamationCircle, IconFileExport, IconSettings } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { Key } from '../../Settings/Key';
import { SideBarButtonAccountId } from '../../Sidebar/SideBarButtonAccountId';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { IconAbout } from './IconAbout';
import { IconQuestion } from './IconQuestion';
import { PluginKeys } from './PluginKeys';

import Swal from 'sweetalert2';
import accountIDModal from '../../Payments/accountIDModal';

//This is a custom event that will be dispatched when a change is made to localStorage. It works with the account ID to update the UI in real-time.
interface LocalStorageChangeEventDetail {
  credit_id: string;
}

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);

  const {
    state: {
      apiKey,
      lightMode,
      serverSideApiKeyIsSet,
      serverSidePluginKeysSet,
      conversations,
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);

  const handleAbout = () => {
    Swal.fire({
      title: 'About',
      html: `
      <div style="text-align: left;">
        <!-- Start of formatted content -->
        <p>PayPerQ is a pay-per-query Chatbot that leverages the openAI's API and Bitcoin to bring GPT4 access to more people globally. It was created by <a href="https://twitter.com/mattahlborg" target="_blank" rel="noopener" style="color: blue; text-decoration: underline;">Matt Ahlborg</a>.</p>
        <br></br>
        <!-- End of formatted content -->
      </div>`,
      icon: 'info',
      confirmButtonColor: '#202123',
    });
  };
  const handleHowItWorks = () => {
    Swal.fire({
      title: 'How it Works',
      html: `
      <div style="text-align: left;">
        <!-- Start of formatted content -->
        <p>The price per query is determined not only by the number of words in the current question, but by the number of words from the entire conversation history (plus the number words provided in the response).</p>
        <br>
        <p>Put simply, long conversations make queries more costly, so start new chats for cheaper queries.</p>
        <!--End of formatted content-->
      </div>`,
      icon: 'question',
      confirmButtonColor: '#202123',
    });
  };

  const handleHelpMeOut = () => {
    Swal.fire({
      title: 'Feedback / Support',
      html: `
        <div style="text-align: left;">
          <!-- Start of formatted content -->
          <p>I want PayPerQ to become the default ChatGPT experience for Bitcoin adjacent developers and professionals around the world.</p>
          <br>
          <p>What would it take for this to become your primary daily GPT interface?</p>
          <br>
          <p>Please let me know what we can do to get you to that point!</p>
          <!-- End of formatted content -->
        </div>
        <!-- Centered Telegram, Email, and Twitter buttons at the bottom -->
        <div style="text-align: center; padding-top: 20px;">
          <!-- Email Icon/Button -->
          <a
            id="email-btn"
            style="display: inline-block; margin-right: 10px; cursor: pointer;"
          >
            <img src="/email-logo.png" alt="Email" style="width: 30px; height: 30px;">
          </a>
          <!-- Twitter Icon/Button -->
          <a
            href="https://twitter.com/PPQdotAI"
            target="_blank"
            id="twitter-btn"
            style="display: inline-block; margin-right: 10px;"
          >
            <img src="/twitter-logo.png" alt="Twitter" style="width: 30px; height: 30px;">
          </a>
          <!-- Telegram Icon/Button -->
          <a
            href="https://t.me/+ZjJDTazIrV0zNDFh"
            target="_blank"
            id="telegram-btn"
            style="display: inline-block;"
          >
            <img src="/telegram-logo.svg" alt="Telegram" style="width: 30px; height: 30px;">
          </a>
        </div>`,
        icon: 'info',
        confirmButtonColor: '#202123',
        didRender: () => {
          const emailBtn = document.getElementById('email-btn');
          if (emailBtn) {
            emailBtn.addEventListener('click', (event) => {
              event.preventDefault();
              const email = 'matt.ahlborg@gmail.com'; // Set the email address to be copied
              navigator.clipboard.writeText(email).then(() => {
                Swal.fire({ // Display the notification
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  icon: 'success',
                  title: 'Email address copied to clipboard!',
                });
              }).catch(err => {
                console.error('Could not copy text: ', err);
              });
            });
          }
        }
      });
  };

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const [accountId, setAccountId] = useState('N/A');
  const [fullCreditId, setFullCreditId] = useState('N/A');

  useEffect(() => {
    const handleLocalStorageChange = (event: CustomEvent<LocalStorageChangeEventDetail>) => {
      // Assume event.detail.credit_id is the full credit ID
      const fullId = event.detail.credit_id;
      setFullCreditId(fullId); // Store the full credit_id
      
      // Extract and store the part of the credit_id after the first '-'
      const accountIdPart = fullId.split('-')[1];
      setAccountId(accountIdPart);
    };
  
    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener);
  
    // Initial setting from localStorage
    const initialCreditId = localStorage.getItem('credit_id');
    if (initialCreditId) {
      setFullCreditId(initialCreditId); // Store the full initial credit_id directly
      
      // Also extract and set the accountId part
      const initialAccountId = initialCreditId.split('-')[1];
      setAccountId(initialAccountId);
    }
  
    return () => {
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    };
  }, []);
  

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
<SideBarButtonAccountId
  text={`Account ID: ${accountId}`}
  icon={<IconQuestion />}
  onClick={accountIDModal(accountId, fullCreditId)}
/>

      <SidebarButton
        text={t('How it Works / FAQ')}
        icon={<IconQuestion />}
        onClick={() => handleHowItWorks()}
      />

      <SidebarButton
        text={t('About')}
        icon={<IconAbout />}
        onClick={() => handleAbout()}
      />
      <SidebarButton
        text={t('Feedback / Support')}
        icon={<IconExclamationCircle size={18} />}
        onClick={() => handleHelpMeOut()}
      />

      <SidebarButton
        text={t('UI Settings')}
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialog(true)}
      />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData()}
      />

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}
    </div>
  );
};
