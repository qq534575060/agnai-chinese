import { Component } from 'solid-js'
import { setComponentPageTitle } from '../../shared/util'
import { useParams, useSearchParams } from '@solidjs/router'
import { CreateCharacterForm } from './CreateCharacterForm'
import { t } from '/web/shared/AdminChineseLocalizer'

const CreateCharacter: Component = () => {
  const params = useParams<{ editId?: string; duplicateId?: string }>()
  const [query] = useSearchParams()
  setComponentPageTitle(
    params.editId ? t('Edit character') : params.duplicateId ? t('Copy character') : t('Create character')
  )
  return (
    <CreateCharacterForm
      editId={params.editId}
      duplicateId={params.duplicateId}
      import={query.import}
    />
  )
}

export default CreateCharacter
