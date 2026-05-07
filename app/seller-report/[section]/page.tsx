import { DashboardShell } from "../../dashboard-shell";
import { SellerReportDetailContent } from "../../seller-report-detail-content";

type Props = { params: Promise<{ section: string }> };

export default async function SellerReportDetailPage({ params }: Props) {
  const { section } = await params;
  return (
    <DashboardShell>
      <SellerReportDetailContent section={section} />
    </DashboardShell>
  );
}
