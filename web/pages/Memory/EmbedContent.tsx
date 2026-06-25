import { Component, Match, Show, Switch, createSignal } from 'solid-js'
import { toastStore } from '/web/store/toasts'
import TextInput from '/web/shared/TextInput'
import Button from '/web/shared/Button'
import FileInput, { FileInputResult } from '/web/shared/FileInput'
import Divider from '/web/shared/Divider'
import { slugify } from '/common/util'
import { embedApi } from '/web/store/embeddings'
import Select from '/web/shared/Select'
import { getStore } from '/web/store/create'
import { SolidCard } from '/web/shared/Card'
import { pageStore } from '/web/store'
import { createStore } from 'solid-js/store'
import { v4 } from 'uuid'
import { t } from '/web/shared/AdminChineseLocalizer'

export { EmbedContent as default }

const EmbedContent: Component = (props) => {
  const user = getStore('user')((s) => ({ ui: s.ui }))

  const options = ['Article', 'PDF', 'Text file', 'Plain Text']
  const [store, setStore] = createStore({
    wiki: '',
    embedName: '',
    embedText: '',
    type: options[0],
  })

  const [loading, setLoading] = createSignal(false)
  const [file, setFile] = createSignal<File>()

  const embedWiki = async () => {
    setLoading(true)
    try {
      await embedApi.embedArticle(store.wiki)
      toastStore.success(t('Successfully created embedding'))
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const embedFile = async () => {
    if (!store.embedName) {
      toastStore.error(t('Enter a name for the embedding'))
    }

    setLoading(true)
    try {
      const docNeeded = store.type === 'PDF' || store.type === 'Text file'
      const doc = file()
      if (!doc && docNeeded) {
        toastStore.error(t('No PDF loaded'))
        return
      }

      switch (store.type) {
        case 'PDF':
          await embedApi.embedPdf(v4(), store.embedName, doc!)
          break

        case 'Text file':
          await embedApi.embedFile(v4(), store.embedName, doc!)
          break

        case 'Plain Text': {
          if (!store.embedText) {
            toastStore.warn(t('Embedding content is empty'))
            return
          }
          await embedApi.embedPlainText(v4(), store.embedName, store.embedText)
          break
        }
      }
      toastStore.success(t('Successfully created embedding'))
    } finally {
      setLoading(false)
    }
  }

  const onFile = (files: FileInputResult[]) => {
    const file = files[0]
    if (!file) {
      setFile()
      setStore('embedName', '')
      return
    }

    setFile(() => file.file)
    const dot = file.file.name.lastIndexOf('.')
    const name = dot > -1 ? file.file.name.slice(0, dot) : file.file.name
    setStore('embedName', slugify(name))
  }

  return (
    <form class="flex flex-col gap-2">
      <Show when={!user.ui.embeddingModel}>
        <SolidCard bg="premium-700">
          {t('You need to enable')}{' '}
          <b class="underline hover:cursor-pointer" onClick={() => pageStore.settings(true)}>
            {t('Embeddings/Long-Term Memory')}
          </b>{' '}
          {t('in your Settings')}
        </SolidCard>
      </Show>

      <Select
        items={options.map((value) => ({ label: `${t('Embed:')} ${t(value)}`, value }))}
        fieldName="embed-type"
        value={store.type}
        onChange={(ev) => setStore('type', ev.value)}
      />

      <Switch>
        <Match when={store.type === 'Article'}>
          <TextInput
            label={t('Embed Wikipedia Article')}
            helperText={t('Create an embedding using the content from a Wikipedia article')}
            placeholder={t('URL. E.g. https://en.wikipedia.org/wiki/Taylor_Swift')}
            value={store.wiki}
            onChange={(ev) => setStore('wiki', ev.currentTarget.value)}
          />
          <Button class="mt-2 w-fit" disabled={loading()} onClick={embedWiki}>
            {t('Embed Article')}
          </Button>
        </Match>

        <Match when={store.type === 'PDF'}>
          <TextInput
            fieldName="embedName"
            label={t('Name')}
            helperText={t('An identifier for your embedding.')}
            value={store.embedName}
            onChange={(ev) => setStore('embedName', ev.currentTarget.value)}
          />

          <FileInput
            fieldName="pdf"
            label={t('Embed PDF')}
            onUpdate={onFile}
            helperText={t('This may take a long time depending on the size of the PDF.')}
            accept="application/pdf"
          />
          <Button class="mt-2 w-fit" disabled={loading() || !file()} onClick={embedFile}>
            {t('Embed PDF')}
          </Button>
        </Match>

        <Match when={store.type === 'Text file'}>
          <TextInput
            fieldName="embedName"
            label={t('Name')}
            helperText={t(
              '(Optional) An identifier for your embedding. This will become a "slug". E.g. "Hello World" will become "hello-world"'
            )}
            value={store.embedName}
            onChange={(ev) => setStore('embedName', ev.currentTarget.value)}
          />

          <FileInput
            fieldName="pdf"
            label={t('Embed File')}
            onUpdate={onFile}
            helperText={t('This may take a long time depending on the size of the file.')}
            accept="text/plain"
          />
          <Button class="mt-2 w-fit" disabled={loading() || !file()} onClick={embedFile}>
            {t('Embed File')}
          </Button>
        </Match>

        <Match when={store.type === 'Plain Text'}>
          <TextInput
            fieldName="embedName"
            label={t('Name')}
            helperText={t(
              'An identifier for your embedding. This will become a "slug". E.g. "Hello World" will become "hello-world"'
            )}
            value={store.embedName}
            onChange={(ev) => setStore('embedName', ev.currentTarget.value)}
          />

          <TextInput
            fieldName="embedText"
            label={t('Content')}
            helperText={t('The content to be embedded. Use line breaks to seperate lines.')}
            isMultiline
            onChange={(ev) => setStore('embedText', ev.currentTarget.value)}
            class="max-h-80"
          />

          <Button class="mt-2 w-fit" onClick={embedFile}>
            {t('Embed Text')}
          </Button>
        </Match>
      </Switch>

      <Divider />
    </form>
  )
}
