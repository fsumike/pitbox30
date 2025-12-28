import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

const gradleWrapperProps = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-all.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;

const propsPath = 'android/gradle/wrapper/gradle-wrapper.properties';

if (existsSync('android')) {
  mkdirSync(dirname(propsPath), { recursive: true });
  writeFileSync(propsPath, gradleWrapperProps);
  console.log('Updated gradle-wrapper.properties to use Gradle 8.7 (Java 21 compatible)');
} else {
  console.log('Android folder not found, skipping gradle fix');
}
