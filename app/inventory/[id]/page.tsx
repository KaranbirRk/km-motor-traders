import { notFound } from 'next/navigation';
import { getCarById } from '../../../lib/inventoryService';
import CarDetailClient from './CarDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) notFound();

  return <CarDetailClient car={car} />;
}
