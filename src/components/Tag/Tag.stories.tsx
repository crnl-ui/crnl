import type { Meta, StoryObj } from '@storybook/react'
import { Tag, Chip } from './Tag'

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof Tag>

export const Default: Story = {
  args: { children: 'Category' }
}

export const BrandColor: Story = {
  args: { children: 'Home', brandColor: true }
}

export const WithLeadingIcon: Story = {
  args: { children: 'Live', icon: 'fiber_manual_record', iconPosition: 'leading' }
}

export const WithTrailingIcon: Story = {
  args: { children: 'Filter', icon: 'close', iconPosition: 'trailing' }
}

export const ChipBordered: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Chip surface="borderNeutral">All</Chip>
      <Chip surface="borderNeutral" brandColor>Home</Chip>
      <Chip surface="borderNeutral" icon="close" iconPosition="trailing">Filter</Chip>
      <Chip surface="borderNeutral" disabled>Disabled</Chip>
    </div>
  )
}

export const ChipGhost: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Chip surface="ghost">All</Chip>
      <Chip surface="ghost" brandColor>Home</Chip>
    </div>
  )
}
