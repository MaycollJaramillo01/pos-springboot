import { Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';

interface StatsCardProps {
  title: string;
  subtitle: string;
  value: string | number;
  color?: string;
}

const StatsCard = ({ title, subtitle, value, color = 'primary' }: StatsCardProps) => (
  <Card className={`border-0 shadow-sm text-${color}`}>
    <CardBody>
      <CardSubtitle className="text-uppercase small fw-semibold" tag="h6">
        {subtitle}
      </CardSubtitle>
      <CardTitle tag="h3" className="fw-bold text-dark">
        {value}
      </CardTitle>
      <p className="text-muted mb-0">{title}</p>
    </CardBody>
  </Card>
);

export default StatsCard;
