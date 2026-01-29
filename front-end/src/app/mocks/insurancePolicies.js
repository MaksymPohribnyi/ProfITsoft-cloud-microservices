
// Імітація UUID v4 без залежності
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const policyTypes = ['LIFE', 'HEALTH', 'AUTO', 'HOME', 'TRAVEL'];
const riskOptions = ['Fire', 'Theft', 'Accident', 'Natural Disaster', 'Medical Emergency', 'Liability'];

const firstNames = ['Oleksander', 'Mariya', 'Ivan', 'Olena', 'Dmytro', 'Anna', 'Sergiy', 'Tetyana', 'Andriy', 'Nataliya'];
const lastNames = ['Tkachenko', 'Testivich', 'Sydorovych', 'Usyk', 'Testova', 'Boroda,', 'Testenko', 'Shevchenko', 'Testov', 'Testyuchenko'];

const generateRandomDate = (start, end) => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const generateClient = (index) => ({
    id: generateUUID(),
    firstName: firstNames[index % firstNames.length],
    lastName: lastNames[index % lastNames.length],
    email: `${firstNames[index % firstNames.length].toLowerCase()}.${lastNames[index % lastNames.length].toLowerCase()}${index}@example.com`,
    insurancePolicies: []
});

const generateMockClients = () => {
    const clients = [];
    for (let i = 0; i < 30; i++) {
        clients.push(generateClient(i));
    }
    return clients;
};

const generateMockPolicies = (clients) => {
    const policies = [];

    for (let i = 0; i < 30; i++) {
        const client = clients[i % clients.length];
        const startDate = generateRandomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));
        const endDate = generateRandomDate(new Date(startDate), new Date(2026, 11, 31));

        const numRisks = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...riskOptions].sort(() => 0.5 - Math.random());
        const coveredRisks = shuffled.slice(0, numRisks);

        const policy = {
            id: generateUUID(),
            policyNumber: `POL-${String(i + 1).padStart(5, '0')}`,
            policyType: policyTypes[i % policyTypes.length],
            startDate,
            endDate,
            coveredRisks,
            client: {
                id: client.id,
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email
            }
        };

        policies.push(policy);
    }

    return policies;
};

export const MOCK_CLIENTS = generateMockClients();
export const MOCK_POLICIES = generateMockPolicies(MOCK_CLIENTS);
export const RISK_OPTIONS = riskOptions;
export const POLICY_TYPES = policyTypes;

export { generateMockClients };