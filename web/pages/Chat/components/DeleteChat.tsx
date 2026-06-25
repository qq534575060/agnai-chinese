import { Trash, X } from 'lucide-solid'
import { Component } from 'solid-js'
import { AppSchema } from '../../../../common/types/schema'
import Button from '../../../shared/Button'
import Modal from '../../../shared/Modal'
import { chatStore } from '../../../store'
import { useNavigate } from '@solidjs/router'
import { t } from '/web/shared/AdminChineseLocalizer'

const DeleteChatModal: Component<{
  chat?: AppSchema.Chat
  show: boolean
  redirect?: boolean
  close: () => void
}> = (props) => {
  const nav = useNavigate()

  const onDelete = () => {
    if (!props.chat) return
    chatStore.deleteChat(props.chat?._id, props.close)
    if (props.redirect) {
      nav(`/character/${props.chat?.characterId}/chats`)
    }
  }
  return (
    <Modal
      show={props.show && !!props.chat}
      title={t('Confirm Deletion')}
      close={props.close}
      footer={
        <>
          <Button schema="secondary" onClick={props.close}>
            <X />
            {t('Cancel')}
          </Button>

          <Button schema="red" onClick={onDelete}>
            <Trash /> {t('Delete')}
          </Button>
        </>
      }
    >
      <div class="flex flex-col items-center gap-4">
        <div>{t('Are you sure you wish to delete this chat?')}</div>
        <div class="flex justify-center gap-4">{props.chat!.name}</div>
      </div>
    </Modal>
  )
}

export default DeleteChatModal
