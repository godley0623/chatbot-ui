import { IconFileExport, IconSettings } from '@tabler/icons-react';
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
        <p>BitsForBoops is a pay-per-query Chatbot that leverages the openAI's API and Bitcoin to bring GPT4 access to more people globally. It was created by <a href="https://twitter.com/mattahlborg" target="_blank" rel="noopener" style="color: blue; text-decoration: underline;">Matt Ahlborg</a>. If you have any questions or feedback, please reach out to Matt on Twitter.</p>
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
        <p>The cost of each query depends both on the amount of input tokens you give the bot as well as the number of output tokens that it gives back.</p>
        <br></br>
        <p><strong>Important:</strong> The input tokens account for not just the most recent question, but the entire chat history of the current conversation. As the conversation lengthens, the cost for a query increases. To keep queries less expensive, consider starting a new chat session and asking a fresh question.</p>
        <!--End of formatted content-->
      </div>`,
      icon: 'question',
      confirmButtonColor: '#202123',
    });
  };

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const [accountId, setAccountId] = useState('Not Set');
  const [fullCreditId, setFullCreditId] = useState('Not Set');

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
        text={t('How it Works')}
        icon={<IconQuestion />}
        onClick={() => handleHowItWorks()}
      />

      <SidebarButton
        text={t('About')}
        icon={<IconAbout />}
        onClick={() => handleAbout()}
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
