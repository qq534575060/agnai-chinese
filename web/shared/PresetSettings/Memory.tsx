import { Component } from 'solid-js'
import RangeInput from '../RangeInput'
import { PresetTabProps } from '/web/store/preset-context'
import { t } from '/web/shared/AdminChineseLocalizer'

export const MemorySettings: Component<PresetTabProps> = (props) => {
  return (
    <div class="flex flex-col gap-4" classList={{ hidden: props.tab !== 'Memory' }}>
      <div class="flex flex-col gap-2">
        <RangeInput
          fieldName="memoryContextLimit"
          label={t('Memory: Context Limit')}
          helperText={t('The maximum context budget (in tokens) for the memory book.')}
          min={1}
          max={2000}
          step={1}
          value={props.state.memoryContextLimit ?? 500}
          disabled={props.state.disabled}
          onChange={(ev) => props.setters.setState('memoryContextLimit', ev)}
        />

        <RangeInput
          fieldName="memoryChatEmbedLimit"
          label={t('Memory: Long-term Memory Context Budget')}
          helperText={t('If available: The maximum context budget (in tokens) for long-term memory.')}
          min={1}
          max={10000}
          step={1}
          value={props.state.memoryChatEmbedLimit ?? 500}
          disabled={props.state.disabled}
          onChange={(ev) => props.setters.setState('memoryChatEmbedLimit', ev)}
        />

        <RangeInput
          fieldName="memoryUserEmbedLimit"
          label={t('Memory: Embedding Context Budget')}
          helperText={t('If available: The maximum context budget (in tokens) for document embeddings.')}
          min={1}
          max={10000}
          step={1}
          value={props.state.memoryUserEmbedLimit ?? 500}
          disabled={props.state.disabled}
          onChange={(ev) => props.setters.setState('memoryUserEmbedLimit', ev)}
        />

        <RangeInput
          fieldName="memoryDepth"
          label={t('Memory: Chat History Depth')}
          helperText={t('Number of messages to scan in chat history to scan for memory book keywords.')}
          min={1}
          max={100}
          step={1}
          value={props.state.memoryDepth || 50}
          disabled={props.state.disabled}
          onChange={(ev) => props.setters.setState('memoryDepth', ev)}
        />
      </div>
    </div>
  )
}
