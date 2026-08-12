import type { PageId, RoadmapLaneId, ScopeRowId } from "@/components/demo/data"
import { contentByPage } from "@/components/demo/page-data"
import { ArchivedIdeas } from "@/components/sections/demo/archived-ideas"
import { CutList } from "@/components/sections/demo/cut-list"
import { DecisionLog } from "@/components/sections/demo/decision-log"
import { FeatureBacklog } from "@/components/sections/demo/feature-backlog"
import { Home } from "@/components/sections/demo/home"
import { IdeaInbox } from "@/components/sections/demo/idea-inbox"
import { LaunchReview } from "@/components/sections/demo/launch-review"
import { MobileCapture } from "@/components/sections/demo/mobile-capture"
import { MvpScope } from "@/components/sections/demo/mvp-scope"
import { ProjectSearch } from "@/components/sections/demo/project-search"
import { Projects } from "@/components/sections/demo/projects"
import { Readiness } from "@/components/sections/demo/readiness"
import { Roadmap } from "@/components/sections/demo/roadmap"
import { WeeklyReview } from "@/components/sections/demo/weekly-review"

interface Props {
  activePageId: PageId
  interactive: boolean
  onSelectedLaneChange: (laneId: RoadmapLaneId) => void
  onSelectedRowChange: (rowId: ScopeRowId) => void
  selectedLaneId: RoadmapLaneId
  selectedRowId: ScopeRowId
}

export const Page = ({
  activePageId,
  interactive,
  onSelectedLaneChange,
  onSelectedRowChange,
  selectedLaneId,
  selectedRowId,
}: Props) => {
  const content = contentByPage[activePageId]

  switch (activePageId) {
    case "idea-inbox":
      return <IdeaInbox content={content} />
    case "feature-backlog":
      return (
        <FeatureBacklog
          content={content}
          interactive={interactive}
          onSelectedRowChange={onSelectedRowChange}
          selectedRowId={selectedRowId}
        />
      )
    case "scope":
      return (
        <MvpScope
          content={content}
          interactive={interactive}
          onSelectedRowChange={onSelectedRowChange}
          selectedRowId={selectedRowId}
        />
      )
    case "roadmap":
      return (
        <Roadmap
          content={content}
          interactive={interactive}
          onSelectedLaneChange={onSelectedLaneChange}
          selectedLaneId={selectedLaneId}
        />
      )
    case "readiness":
      return <Readiness content={content} />
    case "weekly-review":
      return <WeeklyReview content={content} />
    case "cut-list":
      return <CutList content={content} />
    case "decision-log":
      return <DecisionLog content={content} />
    case "launch-review":
      return <LaunchReview content={content} />
    case "search":
      return <ProjectSearch content={content} />
    case "archive":
      return <ArchivedIdeas content={content} />
    case "projects":
      return <Projects content={content} />
    case "mobile-capture":
      return <MobileCapture content={content} />
    default:
      return <Home content={content} />
  }
}
