import { declareAction } from '@reatom/core';

const NS = 'client';

export const setOnlineStatus = declareAction<any>(NS + ':setOnlineStatus');
