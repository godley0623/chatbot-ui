import { IconExternalLink } from '@tabler/icons-react';
import { useContext, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import { OpenAIModel } from '@/types/openai';

import HomeContext from '@/pages/api/home/home.context';

import { models, defaultModel } from '../../controller/modelDetails';

export const ModelSelect = () => {
  const { t } = useTranslation('chat');
  const selectRef = useRef(null)

  const {
    state: { selectedConversation, defaultModelId },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);
  
  const savedModel = localStorage.getItem('saved-model') || ""
  const modelArr = []

  for (let i = 0; i < models.length; i++) {
    if (savedModel && models[i].id === savedModel) {
      modelArr.unshift(models[i])
    } else if (!savedModel && models[i].id === defaultModel) {
      modelArr.unshift(models[i])
    } else {
      modelArr.push(models[i])
    }
  }
  console.log(savedModel)
  console.log(modelArr)

  useEffect(() => {
    selectedConversation &&
    handleUpdateConversation(selectedConversation, {
      key: 'model',
      value: models.find(
        (model) => model.id === savedModel || defaultModel,
      ) as OpenAIModel,
    });
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: models.find(
          (model) => model.id === e.target.value,
        ) as OpenAIModel,
      });
      localStorage.setItem('saved-model', e.target.value)
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
        {t('Model')}
      </label>
      <div className="w-full rounded-lg border border-neutral-200 bg-transparent pr-2 text-neutral-900 dark:border-neutral-600 dark:text-white">
        <select
          ref={selectRef}
          className="w-full bg-transparent p-2"
          placeholder={t('Select a model') || ''}
          onChange={handleChange}
        >
          {modelArr.map((model) => (
            <option
              key={model.id}
              value={model.id}
              className="dark:bg-[#343541] dark:text-white"
            >
              {model.id !== defaultModelId
                ? `Default (${model.name})`
                : model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full mt-3 text-left text-neutral-700 dark:text-neutral-400 flex items-center">
      </div>
    </div>
  );
};
