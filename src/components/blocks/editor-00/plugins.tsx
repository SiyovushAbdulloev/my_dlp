import { useState } from 'react'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContentEditable } from '@/components/editor/editor-ui/content-editable'
import { BlockFormatDropDown } from '@/components/editor/plugins/toolbar/block-format-toolbar-plugin'
import { FormatBulletedList } from '@/components/editor/plugins/toolbar/block-format/format-bulleted-list'
import { FormatCheckList } from '@/components/editor/plugins/toolbar/block-format/format-check-list'
import { FormatHeading } from '@/components/editor/plugins/toolbar/block-format/format-heading'
import { FormatNumberedList } from '@/components/editor/plugins/toolbar/block-format/format-numbered-list'
import { FormatParagraph } from '@/components/editor/plugins/toolbar/block-format/format-paragraph'
import { FormatQuote } from '@/components/editor/plugins/toolbar/block-format/format-quote'
import { ClearFormattingToolbarPlugin } from '@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin'
import { ElementFormatToolbarPlugin } from '@/components/editor/plugins/toolbar/element-format-toolbar-plugin'
import { FontBackgroundToolbarPlugin } from '@/components/editor/plugins/toolbar/font-background-toolbar-plugin'
import { FontColorToolbarPlugin } from '@/components/editor/plugins/toolbar/font-color-toolbar-plugin'
import { FontFamilyToolbarPlugin } from '@/components/editor/plugins/toolbar/font-family-toolbar-plugin'
import { FontFormatToolbarPlugin } from '@/components/editor/plugins/toolbar/font-format-toolbar-plugin'
import { FontSizeToolbarPlugin } from '@/components/editor/plugins/toolbar/font-size-toolbar-plugin'
import { HistoryToolbarPlugin } from '@/components/editor/plugins/toolbar/history-toolbar-plugin'
import { LinkToolbarPlugin } from '@/components/editor/plugins/toolbar/link-toolbar-plugin'
import { SubSuperToolbarPlugin } from '@/components/editor/plugins/toolbar/subsuper-toolbar-plugin.tsx'
import { ToolbarPlugin } from '@/components/editor/plugins/toolbar/toolbar-plugin'

export function Plugins() {
  const [, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)
  const [, setIsLinkEditMode] = useState<boolean>(false)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className='relative'>
      {/* toolbar plugins */}
      <div className='relative'>
        <RichTextPlugin
          contentEditable={
            <div className=''>
              <div className='' ref={onRef}>
                <ContentEditable placeholder={'Start typing ...'} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ToolbarPlugin>
          {() => (
            <div className='vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1'>
              <Button variant='outline' size='icon' className='h-8 w-8'>
                <Plus />
              </Button>
              <BlockFormatDropDown>
                <FormatParagraph />
                <FormatHeading levels={['h1', 'h2', 'h3']} />
                <FormatNumberedList />
                <FormatBulletedList />
                <FormatCheckList />
                <FormatQuote />
              </BlockFormatDropDown>
              <ClearFormattingToolbarPlugin />
              <ElementFormatToolbarPlugin />
              <FontColorToolbarPlugin />
              <FontBackgroundToolbarPlugin />
              <FontFamilyToolbarPlugin />
              <FontFormatToolbarPlugin />
              <FontSizeToolbarPlugin />
              <HistoryToolbarPlugin />
              <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
              <SubSuperToolbarPlugin />
            </div>
          )}
        </ToolbarPlugin>
      </div>
      {/* actions plugins */}
    </div>
  )
}
