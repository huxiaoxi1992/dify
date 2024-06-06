'use client'
import type { FC } from 'react'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
} from '@/app/components/base/portal-to-follow-elem'
import { Lock01 } from '@/app/components/base/icons/src/vender/solid/security'
import Button from '@/app/components/base/button'
import type { FirecrawlConfig } from '@/models/common'
import Field from '@/app/components/datasets/create/website/firecrawl/base/field'
import Toast from '@/app/components/base/toast'
import { createFirecrawlApiKey } from '@/service/datasets'
import { LinkExternal02 } from '@/app/components/base/icons/src/vender/line/general'
type Props = {
  onCancel: () => void
  onSaved: () => void
}

const I18N_PREFIX = 'datasetCreation.firecrawl'

const DEFAULT_BASE_URL = 'https://api.firecrawl.dev'

const ConfigFirecrawlModal: FC<Props> = ({
  onCancel,
  onSaved,
}) => {
  const { t } = useTranslation()
  const [config, setConfig] = useState<FirecrawlConfig>({
    api_key: '',
    base_url: '',
  })

  const handleConfigChange = useCallback((key: string) => {
    return (value: string | number) => {
      setConfig(prev => ({ ...prev, [key]: value as string }))
    }
  }, [])

  const handleSave = useCallback(async () => {
    let errorMsg = ''
    if (config.base_url && !((config.base_url.startsWith('http://') || config.base_url.startsWith('https://'))))
      errorMsg = t('common.errorMsg.urlError')
    if (!errorMsg) {
      if (!config.api_key) {
        errorMsg = t('common.errorMsg.fieldRequired', {
          field: 'API Key',
        })
      }
      else if (!config.api_key.startsWith('fc-')) {
        errorMsg = t(`${I18N_PREFIX}.apiKeyFormatError`)
      }
    }

    if (errorMsg) {
      Toast.notify({
        type: 'error',
        message: errorMsg,
      })
      return
    }
    const postData = {
      category: 'website',
      provider: 'firecrawl',
      credentials: {
        auth_type: 'bearer',
        config: {
          api_key: config.api_key,
          base_url: config.base_url || DEFAULT_BASE_URL,
        },
      },
    }
    await createFirecrawlApiKey(postData)
    Toast.notify({
      type: 'success',
      message: t('common.operation.saveSuccess'),
    })
    onSaved()
  }, [config.api_key, config.base_url, onSaved, t])

  return (
    <PortalToFollowElem open>
      <PortalToFollowElemContent className='w-full h-full z-[60]'>
        <div className='fixed inset-0 flex items-center justify-center bg-black/[.25]'>
          <div className='mx-2 w-[640px] max-h-[calc(100vh-120px)] bg-white shadow-xl rounded-2xl overflow-y-auto'>
            <div className='px-8 pt-8'>
              <div className='flex justify-between items-center mb-4'>
                <div className='text-xl font-semibold text-gray-900'>{t(`${I18N_PREFIX}.configFirecrawl`)}</div>
              </div>

              <div className='space-y-4'>
                <Field
                  label='Base URL'
                  labelClassName='!text-sm'
                  value={config.base_url}
                  onChange={handleConfigChange('base_url')}
                  placeholder={DEFAULT_BASE_URL}
                />
                <Field
                  label='API Key'
                  labelClassName='!text-sm'
                  isRequired
                  value={config.api_key}
                  onChange={handleConfigChange('api_key')}
                  placeholder={t(`${I18N_PREFIX}.apiKeyPlaceholder`)!}
                />
              </div>
              <div className='my-8 flex justify-between items-center h-8'>
                <a className='flex items-center space-x-1 leading-[18px] text-xs font-normal text-[#155EEF]' target='_blank' href='https://www.firecrawl.dev/account'>
                  <span>{t(`${I18N_PREFIX}.getApiKeyLinkText`)}</span>
                  <LinkExternal02 className='w-3 h-3' />
                </a>
                <div className='flex'>
                  <Button
                    className='mr-2 h-9 text-sm font-medium text-gray-700'
                    onClick={onCancel}
                  >
                    {t('common.operation.cancel')}
                  </Button>
                  <Button
                    className='h-9 text-sm font-medium'
                    type='primary'
                    onClick={handleSave}
                  >
                    {t('common.operation.save')}
                  </Button>
                </div>

              </div>
            </div>
            <div className='border-t-[0.5px] border-t-black/5'>
              <div className='flex justify-center items-center py-3 bg-gray-50 text-xs text-gray-500'>
                <Lock01 className='mr-1 w-3 h-3 text-gray-500' />
                {t('common.modelProvider.encrypted.front')}
                <a
                  className='text-primary-600 mx-1'
                  target='_blank' rel='noopener noreferrer'
                  href='https://pycryptodome.readthedocs.io/en/latest/src/cipher/oaep.html'
                >
                  PKCS1_OAEP
                </a>
                {t('common.modelProvider.encrypted.back')}
              </div>
            </div>
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}
export default React.memo(ConfigFirecrawlModal)
