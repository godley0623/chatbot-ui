import { IconFileExport, IconSettings } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { Import } from '../../Settings/Import';
import { Key } from '../../Settings/Key';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { PluginKeys } from './PluginKeys';
import { IconAbout } from './IconAbout';
import { IconQuestion } from './IconQuestion';
import Swal from 'sweetalert2';

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
      title: "About",
      html: `
      <div style="text-align: left;">
        <!-- Start of formatted content -->
        <p>BitsForBoops is a pay-per-query Chatbot that leverages the openAI's API and Bitcoin to bring GPT4 access to more people in the world. It was created by <a href="https://twitter.com/mattahlborg" target="_blank" rel="noopener" style="color: blue; text-decoration: underline;">Matt Ahlborg</a>. If you have any questions or feedback, please reach out to Matt on Twitter.</p>
        <br></br>
        <p>BitsForBoops currently only works with with Alby Extension, but more payment functionality will be added soon.</p>
        <br></br>
        <p>BitsForBoops uses <a href="https://github.com/mckaywrigley" target="_blank" rel="noopener" style="color: blue; text-decoration: underline;">mckaywrigley's</a> wonderful <a href="https://github.com/mckaywrigley/chatbot-ui" target="_blank" rel="noopener" style="color: blue; text-decoration: underline;">Chatbot UI</a> as a starting point.</p>
        <!-- End of formatted content -->
      </div>`,
      icon: "info",
      confirmButtonColor: "#202123"
    })
  }
  const handleHowItWorks = () => {
    Swal.fire({
      title: "How it Works",
      html: `
      <div style="text-align: left;">
        <!-- Start of formatted content -->
        <p>The cost of each query depends both on the amount of input tokens you give the bot as well as the number of output tokens that it gives back.</p>
        <br></br>
        <p><strong>Important:</strong> The input tokens account for not just the most recent question, but the entire chat history of the current conversation. As the conversation lengthens, the cost for a query increases. To keep queries less expensive, consider starting a new chat session and asking a fresh question.</p>
        <!-- End of formatted content -->
      </div>`,
      icon: "question",
      confirmButtonColor: "#202123"
    })
  }

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

      <Import onImport={handleImportConversations} />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData()}
      />

      <SidebarButton
        text={t('Settings')}
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialog(true)}
      />

      <SidebarButton
        text={t('About')}
        icon={<IconAbout />}
        onClick={() => handleAbout()}
      />
      <SidebarButton
        text={t('How it Works')}
        icon={<IconQuestion />}
        onClick={() => handleHowItWorks()}
      />

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
    </div>
  );
};
