import { UUID } from '../models/common/common.types';
import { AccountGrips } from '../atoms/account-grips/account-grips.atom';
import { useAtom } from '../store/reatom';

export function useCurrentAccountId() {
    return useAtom(AccountGrips)?.currentID;
}

export function useCurrentAccount() {
    return useAtom(AccountGrips)?.current;
}

export function useAccount(accountId: UUID) {
    return useAtom(
        AccountGrips,
        ({accounts}) => accounts.get(accountId),
        [accountId],
    );
}
