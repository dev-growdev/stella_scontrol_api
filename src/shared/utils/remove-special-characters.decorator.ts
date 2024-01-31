import { TransformFnParams } from 'class-transformer';

export function RemoveSpecialCharacters(params: TransformFnParams): string {
  if (params.value && typeof params.value === 'string') {
    return params.value.replace(/\W/g, '');
  }
  return params.value;
}
