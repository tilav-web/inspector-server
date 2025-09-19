import { GenderEnum } from 'src/enums/gender.enum';
import { CreateInspectorWorkplaceDto } from 'src/modules/inspector-workplace/dto/create-inspector-workplace.dto';

export class CreateInspectorDto {
  first_name: string;
  last_name: string;
  middle_name: string;
  birthday: string;
  rank: string; // MFY Inspector ==== unvoni
  region: string;
  district: string;
  neighborhood: string;
  pinfl: number;
  passport_number: number;
  passport_series: string;
  gender: GenderEnum;
  phone: string;
  nationality: string; // millati
  workplaces: CreateInspectorWorkplaceDto[];
}
