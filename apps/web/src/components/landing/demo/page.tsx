import type {
  PageId,
  RoadmapLaneId,
  ScopeRowId,
} from "@/components/landing/demo/data"
import { contentByPage } from "@/components/landing/demo/page-data"
import { ArchivedIdeas } from "@/components/sections/landing/demo/archived-ideas"
import { CutList } from "@/components/sections/landing/demo/cut-list"
import { DecisionLog } from "@/components/sections/landing/demo/decision-log"
import { FeatureBacklog } from "@/components/sections/landing/demo/feature-backlog"
import { Home } from "@/components/sections/landing/demo/home"
import { IdeaInbox } from "@/components/sections/landing/demo/idea-inbox"
import { LaunchReview } from "@/components/sections/landing/demo/launch-review"
import { MobileCapture } from "@/components/sections/landing/demo/mobile-capture"
import { MvpScope } from "@/components/sections/landing/demo/mvp-scope"
import { ProjectSearch } from "@/components/sections/landing/demo/project-search"
import { Projects } from "@/components/sections/landing/demo/projects"
import { Readiness } from "@/components/sections/landing/demo/readiness"
import { Roadmap } from "@/components/sections/landing/demo/roadmap"
import { WeeklyReview } from "@/components/sections/landing/demo/weekly-review"

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
