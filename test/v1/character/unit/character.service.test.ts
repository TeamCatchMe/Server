import { CharacterRepositoryInterface } from '@modules/v1/character/interfaces/character-repository.interface';
import CharacterRepository from '@modules/v1/character/character.repository';
import { CharacterService } from '@modules/v1/character/character.service';
import { ConflictException } from '@nestjs/common';
import { Character } from '@prisma/client';
import { anyString, instance, mock, reset, when } from 'ts-mockito';

describe('characterService 테스트', () => {
  let service: CharacterService;
  let characterRepository: CharacterRepositoryInterface;

  beforeEach(async () => {
    characterRepository = mock(CharacterRepository);
    let characterRepositoryInstance = instance(characterRepository);
    service = new CharacterService(characterRepositoryInstance);
  });

  afterEach(async () => {
    reset(characterRepository);
  });

  it(`Service 및 Repository 정의 테스트`, () => {
    expect(service).toBeDefined();
    expect(characterRepository).toBeDefined();
  });

  describe(`✔️ 캐츄  생성 테스트`, () => {
    it(`캐츄 생성에 성공한 경우`, async () => {
      const NEW_NICKNAME = generateRandomString();

      // stub
      when(
        await characterRepository.findByCharacterName(anyString()),
      ).thenReturn();
      when(await characterRepository.create(NEW_NICKNAME, 1, false)).thenReturn(
        createCharacter({ name: NEW_NICKNAME }),
      );

      const input = createCharacter({ name: NEW_NICKNAME });
      const result = await service.createCharacter(NEW_NICKNAME, 1, false);

      expect(input.id).toBe(result.id);
      expect(input.name).toBe(result.name);
    });

    it(`이미 사용중인 이름의 캐츄가 있는 경우 ConflictException으로 처리된다.`, async () => {
      const NEW_NICKNAME = generateRandomString();

      // stub
      when(
        await characterRepository.findByCharacterName(NEW_NICKNAME),
      ).thenReturn(createCharacter({ name: NEW_NICKNAME }));

      const result = async () => {
        await service.createCharacter(NEW_NICKNAME, 1, false);
      };

      await expect(result).rejects.toThrowError(
        new ConflictException('이미 사용중인 캐츄 이름입니다.'),
      );
    });
  });
});

const generateRandomString = () => {
  return (Math.random() * 10).toString().replace('.', '');
};

const createCharacter = (params: Partial<Character>) => {
  const character: Character = {
    id: params.id || 2,
    name: params.name || 'testcharacter',
    type: params.type || 1,
    level: params.level || 1,
    is_public: params.is_public || false,
    is_delete: params.is_delete || false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return character;
};
