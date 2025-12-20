import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CheckboxElement from '../src/components/layout/table/controls/CheckboxElement.vue'
import { CheckboxState } from '../src/components/layout/table/types'

describe('selection checkbox', () => {
  it('blocks selection during loading and resumes when enabled', async () => {
    const wrapper = mount(CheckboxElement, {
      props: { value: CheckboxState.UNCHECKED, disabled: true },
    })
    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    await wrapper.setProps({ disabled: false })
    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.find('input').element.type).toBe('checkbox')
    wrapper.unmount()
  })
})
