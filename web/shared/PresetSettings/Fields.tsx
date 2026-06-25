import { Component, Show, createMemo } from 'solid-js'
import TextInput from '../TextInput'
import { ToggleButton } from '../Button'
import RangeInput from '../RangeInput'
import Select from '../Select'
import { MODEL_FORMATS } from './General'
import { FormLabel } from '../FormLabel'
import { SubscriptionModelLevel } from '/common/types/presets'
import { Card } from '../Card'
import PromptEditor from '../PromptEditor'
import { ThirdPartyFormat } from '/common/adapters'
import { PresetTabProps } from '/web/store/preset-context'
import { t } from '/web/shared/AdminChineseLocalizer'

export type FieldProps = Omit<PresetTabProps, 'tab'>
export type Field<T = {}, TOnly extends keyof FieldProps = keyof FieldProps> = Component<
  Pick<FieldProps, TOnly> & T
>

export const PresetMode: Field = (props) => {
  return (
    <div>
      <Select
        fieldName="presetMode"
        label={t('Preset Mode')}
        helperText={t('Toggle between using "essential options" and all available controls.')}
        value={props.state.presetMode}
        items={[
          { label: t('Advanced'), value: 'advanced' },
          { label: t('Simple'), value: 'simple' },
        ]}
        onChange={(ev) => props.setters.setState('presetMode', ev.value as any)}
      />
    </div>
  )
}

export const ResponseLength: Field<{
  subMax: Partial<SubscriptionModelLevel>
}> = (props) => {
  return (
    <RangeInput
      fieldName="maxTokens"
      label={t('Response Length')}
      helperText={t("Maximum length of the response. Measured in 'tokens'")}
      min={16}
      max={2048}
      step={1}
      value={props.state.maxTokens}
      disabled={props.state.disabled}
      onChange={(val) => props.setters.setState('maxTokens', val)}
      recommended={props.subMax.maxTokens}
      recommendLabel={t('Max')}
    />
  )
}

export const ContextSize: Field<{ subMax: Partial<SubscriptionModelLevel> }> = (props) => {
  const maxCtx = createMemo(() => {
    const ctx = props.subMax.maxContextLength
    if (!ctx) return

    const max = Math.round(ctx / 1000)
    return `${max}K`
  })

  return (
    <>
      <RangeInput
        fieldName="maxContextLength"
        label={
          <div class="flex gap-2">
            <div>
              {t('Context Size')}{' '}
              <Show when={maxCtx()}>
                <span class="text-xs italic text-gray-500">({t('Max')}: {maxCtx()})</span>
              </Show>
            </div>

            <ToggleButton
              size="xs"
              fieldName="useMaxContext"
              onText={t('On')}
              offText={t('Off')}
              value={props.state.useMaxContext}
              onChange={(ev) => props.setters.setState('useMaxContext', ev)}
            >
              {t('Use Max If Known:')}
            </ToggleButton>
          </div>
        }
        helperText={
          <>
            <p>
              {t('The amount of infomation sent to the model to generate a response.')}{' '}
              <Show when={props.setters.context.service !== 'agnaistic'}>
                {t('Check your AI service for the maximum context size.')}
              </Show>
            </p>
          </>
        }
        min={16}
        max={props.setters.context.service === 'claude' ? 200000 : 32000}
        step={1}
        value={props.state.maxContextLength || 8192}
        disabled={props.state.disabled}
        onChange={(ev) => props.setters.setState('maxContextLength', ev)}
      />
    </>
  )
}

export const ReasoningTags: Field = (props) => {
  return (
    <div class="flex flex-col gap-1">
      <FormLabel
        label={t('Reasoning Tags')}
        helperText={t('For collapsing reasoning sections in the UI: ')}
      />

      <div class="flex gap-2">
        <TextInput
          prelabel={t('Start')}
          parentClass="w-1/2"
          fieldName="reasoning.start"
          placeholder="<think>"
          value={props.state.reasoning?.start || ''}
          onChange={(ev) =>
            props.setters.setState('reasoning', {
              ...props.state.reasoning,
              start: ev.currentTarget.value,
            })
          }
        />
        <TextInput
          prelabel={t('End')}
          parentClass="w-1/2"
          fieldName="reasoning.end"
          placeholder="</think>"
          value={props.state.reasoning?.end || ''}
          onChange={(ev) =>
            props.setters.setState('reasoning', {
              ...props.state.reasoning,
              end: ev.currentTarget.value,
            })
          }
        />
      </div>
    </div>
  )
}

export const SystemPrompt: Field = (props) => {
  return (
    <Card classList={{ hidden: props.setters.context.hides.systemPrompt ?? false }}>
      <FormLabel
        label={t('System Prompt')}
        helperText={<>{t('The task the AI is performing. Leave blank if uncertain.')}</>}
      />
      <PromptEditor
        fieldName="systemPrompt"
        include={['char', 'user']}
        placeholder="Write {{char}}'s next reply in a fictional chat between {{char}} and {{user}}. Write 1 reply only in internet RP style, italicize actions, and avoid quotation marks. Use markdown. Be proactive, creative, and drive the plot and conversation forward. Write at least 1 paragraph, up to 4. Always stay in character and avoid repetition."
        value={props.state.systemPrompt ?? ''}
        disabled={props.state.disabled}
        onChange={(ev) => props.setters.setState('systemPrompt', ev.prompt!)}
      />
    </Card>
  )
}

export const Jailbreak: Field = (props) => {
  return (
    <Card classList={{ hidden: props.setters.context.hides.ultimeJailbreak ?? false }}>
      <FormLabel
        label={t('Jailbreak (UJB)')}
        helperText={
          <>
            <p>
              <b>{t('Uncensored Models')}</b>:{' '}
              {t('Typically stylistic instructions. E.g. "Respond succinctly using slang"')}
            </p>
            <p>
              <b>{t('Censored Models')}</b>: {t("Instructions to 'jailbreak' from filtering.")}
            </p>
            <p>{t('Large jailbreak prompts can cause repetition. Use this prompt only if needed.')}</p>
          </>
        }
      />

      <PromptEditor
        fieldName="ultimeJailbreak"
        include={['char', 'user']}
        placeholder={t('Respond succinctly using slang')}
        value={props.state.ultimeJailbreak ?? ''}
        disabled={props.state.disabled}
        onChange={(ev) => props.setters.setState('ultimeJailbreak', ev.prompt!)}
      />
    </Card>
  )
}

export const JinjaTemplate: Field = (props) => {
  const allowed: { [format in ThirdPartyFormat]?: boolean } = {
    'openai-chatv2': true,
    'openai-chat': true,
    koboldcpp: true,
    tabby: true,
    aphrodite: true,
    vllm: true,
    ollama: true,
    llamacpp: true,
    ooba: true,
    kobold: true,
    exllamav2: true,
  }

  return (
    <TextInput
      fieldName="jinjaTemplate"
      label={
        <div class="flex w-full justify-between">
          <div>{t('Jinja Template')}</div>
          <ToggleButton
            size="sm"
            onText={t('Enabled')}
            offText={t('Disabled')}
            value={props.state.jinjaEnabled ?? false}
            onChange={(ev) => props.setters.setState('jinjaEnabled', ev)}
          />
        </div>
      }
      helperMarkdown={t(
        'For overriding third-party chat completion templates. Only sent when **Enabled**.\n      If left blank, one will be generated for you.'
      )}
      value={props.state.jinjaTemplate || ''}
      disabled={props.state.disabled}
      hide={!props.setters.context.format || !allowed[props.setters.context.format]}
      onChange={(ev) => props.setters.setState('jinjaTemplate', ev.currentTarget.value)}
      isMultiline
    />
  )
}

export const ModelFormat: Field = (props) => {
  return (
    <>
      <Select
        fieldName="modelFormat"
        label={t('Prompt Format')}
        helperMarkdown={t(
          'Formatting to use if using "Universal Tags" in your prompt template\n      (I.e. `<user>...</user>, <bot>...</bot>`)'
        )}
        items={MODEL_FORMATS}
        value={props.state.modelFormat || 'None'}
        onChange={(ev) => props.setters.setState('modelFormat', ev.value as any)}
      />
    </>
  )
}

export const Temperature: Field = (props) => {
  return (
    <>
      <RangeInput
        fieldName="temp"
        label={t('Temperature')}
        helperText={t(
          'Creativity: Randomness of sampling. High values can increase creativity, but may make text less sensible. Lower values will make text more predictable.'
        )}
        min={0.1}
        max={props.state.presetMode === 'simple' ? 1.5 : 10}
        step={0.01}
        value={props.state.temp}
        disabled={props.state.disabled}
        aiSetting={'temp'}
        recommended={props.sub?.preset.temp}
        onChange={(ev) => {
          props.setters.setState('temp', ev)
        }}
      />
    </>
  )
}
