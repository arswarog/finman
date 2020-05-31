import { declareAction } from '@reatom/core';

const NS = 'client';

export const setOnlineStatus = declareAction<boolean>(NS + ':setOnlineStatus');
