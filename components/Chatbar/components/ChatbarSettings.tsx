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
      text: "BitsForBoops is a pay per query Chatbot leverages the openAI API and which uses Bitcoin for its payments. It was developed by Matt Ahlborg (@mattahlborg on Twitter). If you have any questions or feedback, please reach out to Matt on Twitter.",
      icon: "info",
      confirmButtonColor: "#202123"
    })
  }
  const handleHowItWorks = () => {
    Swal.fire({
      title: "How it Works",
      text: "The cost of each query depends both on the amount of input tokens you give the bot as well as the number of output tokens that it gives back. Importantly, the amount of input tokens is not only from the most recent question, but also the entire chat history of the current conversation that you have open. So, the longer the conversation gets, the more expensive the query will get. If you wish to keep your queries cheaper, you will need to open up a new chat with the bot and ask a fresh question.",
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
