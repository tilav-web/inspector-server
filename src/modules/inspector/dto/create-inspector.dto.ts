import { GenderEnum } from 'src/enums/gender.enum';
import { CreateAuthDto } from 'src/modules/auth/dto/create-auth.dto';
import { CreateInspectorWorkplaceDto } from 'src/modules/inspector-workplace/dto/create-inspector-workplace.dto';

export class CreateInspectorDto {
  auth_details: CreateAuthDto;
  inspector_details: {
    first_name: string;
    last_name: string;
    middle_name: string;
    birthday: string;
    rank: string; // MFY Inspector ==== unvoni
    address: {
      region: string;
      district: string;
      neighborhood: string;
      detail: string;
    };
    pinfl: number;
    passport_number: number;
    passport_series: string;
    gender: GenderEnum;
    phone: string;
    nationality: string; // millati
    photo: Express.Multer.File;
  };
  workplaces_details: CreateInspectorWorkplaceDto[];
}
