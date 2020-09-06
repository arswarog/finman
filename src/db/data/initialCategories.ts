import { IInitialCategoryTree } from '../../models/category/category.types';
import { TransactionType } from '../../models/transaction/transaction.types';
import {
    checkUniqueCategoryList,
    initialCategoriesToCategoryList,
    printCategoryTree,
} from '../../models/category/category.helper';

export const initialCategories: IInitialCategoryTree = [
    {
        id: 'default',
        name: 'Default',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [],
    },
    {
        id: '8ab98385-be7f-4fde-a95e-5a8f65d21ff5',
        name: 'Food',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '33f2f484-3f43-489f-87c4-eb70e067b11d',
                name: 'Supermarket',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '6c8a7d03-8ead-4d74-ae08-b53c33379f0f',
                name: 'Restaurant',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '9ae64500-e2d7-406c-97b9-7d3f9f335f8e',
                name: 'Every day',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'e5791e64-131e-4e18-a0ac-fef603903b68',
                name: 'Sweets',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: 'df53b9ad-3b37-4be5-97bd-d0cfd59f26cf',
        name: 'Entertainment',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '13e21f6b-1889-4411-b105-c0fc458139d9',
                name: 'Cinema and Theatre',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'e891e5e2-c44d-4441-81bc-0831f0395c01',
                name: 'Bar',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'b6d27b02-1e75-4b26-b547-760841b9a519',
                name: 'Concert',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'e0adb90e-75cd-439c-ba3a-fa4aa8683a61',
                name: 'Games',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '5c767710-9c33-4d12-bfca-35957589b949',
        name: 'Car',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '1af5564b-8cc9-4cba-a4e3-8735a3fada93',
                name: 'Fuel',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '0ddd6e2f-7b35-4199-9031-791aa313fa41',
                name: 'Repairs',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '052d504d-acbf-4e8c-aa1a-709bc62b98dc',
                name: 'Car wash',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '129f73e7-d292-4c30-bb9f-2c26e4801943',
        name: 'Home',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '202c1278-944a-48b2-81b2-e8748122877f',
                name: 'Electricity',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'd1e2ba61-0ddd-4777-91a0-0b9db54a6fd1',
                name: 'Rent',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '08989a11-7c49-43d0-b653-c08b3cf4fa5b',
                name: 'Heating',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'b6b9ffa3-32f8-46ab-a016-9430902f740d',
                name: 'Repairs',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '2de769fa-0022-497e-895f-7f0ef0d8a226',
                name: 'Cleaning products',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '3fb2bc6c-3e68-42b3-ad01-6fb62a913069',
        name: 'Clothing',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '0b924ca8-f082-4576-ab44-95036b2ed0e2',
                name: 'Shoes',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'dda2d7f9-7588-41fc-bebc-4243fc4a2bc2',
                name: 'Underwear',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '3f7cbada-22d5-4976-83f0-81dea1d07be8',
        name: 'Electronics',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '70d433e9-45f6-4245-afb2-c7e0f3d4a59f',
                name: 'Computer',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '8e22d7d5-ff17-43d3-ad92-dc9d082d54fb',
                name: 'Phone',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '59bd0485-924a-4eda-886a-fa8c7d1f152c',
                name: 'Tablet',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'f7156d82-2ab8-4733-8749-e1d28da5bc77',
                name: 'Games',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '4f9d962e-d54c-4856-86d0-3d5f1ab564c8',
                name: 'Camera',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '24214795-4bf0-4565-bdb3-3abd5c7340b1',
                name: 'TV',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '2b566916-496b-421e-8c86-d193218652b0',
        name: 'Health and beauty',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: 'd1d90f60-544f-4188-b771-efb1961801ff',
                name: 'Cosmetics',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'ab64c9e4-3e87-4b19-b6a6-1f10bac6b8d6',
                name: 'Hairdresser',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '07b827ea-0ceb-439e-947e-f13c5df7685d',
                name: 'Medicaments',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '9fee5ede-17ce-49fb-b707-fab876b18828',
        name: 'Children',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '7eea81a5-d78f-4f33-b047-e6f2298c47f8',
                name: 'Toys',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'e1a85134-ea03-424d-8be9-0b6229431127',
                name: 'Clothing',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '7fad55e7-69a9-482a-a57c-d4a16cff7e81',
                name: 'School',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'd0814931-ccba-4ea3-93c6-82f4421a4137',
                name: 'Pocket money',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: 'f66ff2a5-03ad-48ae-a89d-d98ba667fb85',
        name: 'Pets',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: 'cf02b71c-b83d-43b2-9011-b23b2862b770',
                name: 'Toys',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '3b438751-8093-4025-8b49-694cb150aae3',
                name: 'Medicaments',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '845e7c5a-a0c0-4955-9f5d-4d42aad99803',
        name: 'Work',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: 'a03b4d99-a3b4-4d3b-beef-26331a18891d',
                name: 'Salary',
                image: 'default',
                defaultType: TransactionType.Income,
            },
            {
                id: '09bec873-fbb1-4d72-b5c0-ae094267db9d',
                name: 'Bonus',
                image: 'default',
                defaultType: TransactionType.Income,
            },
            {
                id: 'd814bba2-c209-4d82-a2a9-53c77f9b06e6',
                name: 'Transport',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '21cc2211-289a-49aa-b638-acdbfbf7f8c9',
        name: 'Transport',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '86d9b4fc-9936-4aba-8967-0cb0713307d1',
                name: 'Carshering',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '35bc9997-5e95-4c52-8cb0-55fb1cd05c6d',
                name: 'Taxi',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '3e348d22-14b8-4ee7-a709-4a164695f498',
                name: 'Local trip',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '81a9a17f-607a-4c3f-a2a5-c701e7a211f7',
                name: 'Long trip',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '47625cb8-6656-45cd-90d8-d55341ca8b72',
                name: 'Airplane',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '887919e2-2c70-417b-b1e6-17068631b2d3',
        name: 'Internet and phones',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '872d0dbe-f09b-4445-9cc2-632e47de4974',
                name: 'Home internet',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'e992dd7d-a7dd-4029-ae57-880feffadc04',
                name: 'Mobile internet',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '8faa7cb8-b849-471e-94cf-58bbea8105e1',
                name: 'Cellphone',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '0e00a51d-3f13-4d84-a019-fc12e2192dc5',
                name: 'Media subscriptions',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '10c42929-dfc2-4fed-858b-38b55adf50d8',
        name: 'Banks',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [
            {
                id: '36de097d-5cdb-4a6c-b8ce-2f0133beac07',
                name: 'Tax',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '1296d699-dbb0-485c-9e2c-68c0b5002595',
                name: 'Credit',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'f2b38e86-ba4c-411f-8d7d-1aa64d56a34a',
                name: 'Mortgage',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: '67242cb6-100c-4db3-829b-519e9fa685dc',
                name: 'Investment',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
            {
                id: 'd62cf77b-adac-4906-ac1a-0265d641cf27',
                name: 'Accumulated interest',
                image: 'default',
                defaultType: TransactionType.Expense,
            },
        ],
    },
    {
        id: '7918729f-554c-4873-8487-16b9a4246659',
        name: 'Hobby',
        image: 'default',
        defaultType: TransactionType.Expense,
        children: [],
    },
];

checkUniqueCategoryList(initialCategoriesToCategoryList(initialCategories));

printCategoryTree(initialCategories);
