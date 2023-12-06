import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate"; // ES Modules import
import fs from "fs/promises";

const config = {
  region: "eu-central-1",
};

const translateText = async (text, sourceLanguageCode, targetLanguageCode) => {
    const client = new TranslateClient(config);

    // // Read the file contents
    // const filePath = "./sample.txt";
    // const fileContents = fs.readFileSync(filePath, "utf8");

    // const input = { // TranslateTextRequest
    //   Text: fileContents, // required
    //   SourceLanguageCode: "en", // required
    //   TargetLanguageCode: "fr", // required
    // };

    const params = {
      SourceLanguageCode: sourceLanguageCode,
      TargetLanguageCode: targetLanguageCode,
      Text: text,
    };

    const command = new TranslateTextCommand(params);

    try {
      const response = await client.send(command);
      console.log(response);
      return response.TranslatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
};

const translateFile = async (inputFilePath, outputFilePath, sourceLanguageCode, targetLanguageCode) => {
  try {
      const content = await fs.readFile(inputFilePath, 'utf-8');
      const translatedContent = await translateText(content, sourceLanguageCode, targetLanguageCode);
      await fs.writeFile(outputFilePath, translatedContent, 'utf-8');
      console.log('Translation completed successfully.');
  } catch (error) {
      console.error('Error:', error);
  }
};

// Example usage
translateFile('input.md', 'output.md', 'en', 'nl');



// { // GetParallelDataResponse
//   ParallelDataProperties: { // ParallelDataProperties
//     Name: "STRING_VALUE",
//     Arn: "STRING_VALUE",
//     Description: "STRING_VALUE",
//     Status: "CREATING" || "UPDATING" || "ACTIVE" || "DELETING" || "FAILED",
//     SourceLanguageCode: "STRING_VALUE",
//     TargetLanguageCodes: [ // LanguageCodeStringList
//       "STRING_VALUE",
//     ],
//     ParallelDataConfig: { // ParallelDataConfig
//       S3Uri: "STRING_VALUE",
//       Format: "TSV" || "CSV" || "TMX",
//     },
//     Message: "STRING_VALUE",
//     ImportedDataSize: Number("long"),
//     ImportedRecordCount: Number("long"),
//     FailedRecordCount: Number("long"),
//     SkippedRecordCount: Number("long"),
//     EncryptionKey: { // EncryptionKey
//       Type: "KMS", // required
//       Id: "STRING_VALUE", // required
//     },
//     CreatedAt: new Date("TIMESTAMP"),
//     LastUpdatedAt: new Date("TIMESTAMP"),
//     LatestUpdateAttemptStatus: "CREATING" || "UPDATING" || "ACTIVE" || "DELETING" || "FAILED",
//     LatestUpdateAttemptAt: new Date("TIMESTAMP"),
//   },
//   DataLocation: { // ParallelDataDataLocation
//     RepositoryType: "STRING_VALUE", // required
//     Location: "STRING_VALUE", // required
//   },
//   AuxiliaryDataLocation: {
//     RepositoryType: "STRING_VALUE", // required
//     Location: "STRING_VALUE", // required
//   },
//   LatestUpdateAttemptAuxiliaryDataLocation: {
//     RepositoryType: "STRING_VALUE", // required
//     Location: "STRING_VALUE", // required
//   },
// };
